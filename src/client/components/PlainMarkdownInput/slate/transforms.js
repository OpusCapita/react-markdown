// common reg expressions
const olRegExp = /^ *[0-9]+\.\s/m;
const ulRegExp = /^ *[\*\+\-]\s/m;
const h1RegExp = /^#\s/m;
const h2RegExp = /^##\s/m;
const h3RegExp = /^###\s/m;
const h4RegExp = /^####\s/m;
const h5RegExp = /^#####\s/m;
const h6RegExp = /^######\s/m;

const lengths = {
  bold: 2,
  italic: 1,
  'strikethrough': 2,
  all: 3,
};

function getMarkPositions({ state, markType }) {
  const { startOffset, endOffset } = state;
  let hasMark = true;
  let startPos = startOffset - 1;

  while (hasMark && startPos >= 0) {
    const marks = state.customCharacters.get(startPos).marks.toArray();
    let hasMarkOfPos = false;
    for (let i = 0; i < marks.length; i++) {
      if (markType === marks[i].type) {
        hasMarkOfPos = true;
        break;
      }
    }

    if (hasMarkOfPos) {
      startPos--;
    } else {
      hasMark = false;
    }
  }
  startPos++;

  let endPos = endOffset;
  hasMark = true;
  while (hasMark && endPos < state.customCharacters.size) {
    const marks = state.customCharacters.get(endPos).marks.toArray();
    let hasMarkOfPos = false;
    for (let i = 0; i < marks.length; i++) {
      if (markType === marks[i].type) {
        hasMarkOfPos = true;
        break;
      }
    }

    if (hasMarkOfPos) {
      endPos++;
    } else {
      hasMark = false;
    }
  }
  endPos--;

  return { startPos, endPos };
}

function unwrapText({ state, markType }) {
  const { startOffset, endOffset, focusText } = state;
  const { startPos, endPos } = getMarkPositions({ state, markType });

  if (startOffset === endOffset && (startOffset === startPos || startOffset === endPos + 1)) {
    return state;
  }

  const markLength = lengths[markType];
  const startNewOffset = Math.max(startPos, startOffset - markLength);
  let maxNewEndPos = endPos - markLength * 2 + 1;

  const endNewOffset = Math.min(endOffset - markLength, maxNewEndPos);
  return state.transform().
    removeTextByKey(focusText.key, endPos - markLength + 1, markLength). // Remove a closing mark
    removeTextByKey(focusText.key, startPos, markLength). // Remove an opening mark
    moveOffsetsTo(startNewOffset, endNewOffset).
    focus().apply();
}

function getPreviousLineEnd(state) {
  const { startOffset, focusText } = state;
  const text = focusText.text;
  const startPos = startOffset - (text[startOffset] === '\n' ? 1 : 0);
  return text.lastIndexOf('\n', startPos);
}

export const getCurrentLine = state => {
  const { startOffset, focusText } = state;
  const text = focusText.text;

  if (startOffset === 0 && text[startOffset] === '\n' ||
    text[startOffset - 1] === '\n' && text[startOffset] === '\n') {
    return '';
  }

  const prevLineEnd = getPreviousLineEnd(state);
  return (prevLineEnd === -1 ? text : text.substr(prevLineEnd + 1)).split('\n', 1)[0];
};

/**
 * Has block selected
 *
 * @param regExp - match regexp
 * @param state - editor state
 */
function hasBlock(regExp, state) {
  let currLine = getCurrentLine(state);
  return regExp.test(currLine);
}

/**
 * Unwrap block
 *
 * @param removedLength - first length should be removed
 * @param state - editor state
 */
const unwrapBlock = function(removedLength, state) {
  const { startOffset, endOffset } = state;
  const prevLineEnd = getPreviousLineEnd(state);
  return state.transform().
    moveOffsetsTo(prevLineEnd + 1).
    deleteForward(removedLength).
    moveOffsetsTo(Math.max(startOffset - removedLength, 0), Math.max(endOffset - removedLength, 0)).
    focus().apply();
};

/**
 * Wrap block
 *
 * @param matchRules - list of regexp
 * @param text - marker of the block
 * @param state - editor state
 */
const wrapBlock = function(matchRules, text, state) {
  const { startOffset, endOffset } = state;
  let currLine = getCurrentLine(state);
  const previousLineEnd = getPreviousLineEnd(state);
  let afterState = state;
  let length = 0;
  for (let i = 0, k = matchRules.length; i < k; i++) {
    const result = matchRules[i].exec(currLine);
    if (result) {
      length = result[0].length;
      afterState = unwrapBlock(length, state);
      break;
    }
  }

  const delta = text.length - length;

  return afterState.transform().
    moveOffsetsTo(previousLineEnd + 1).
    insertText(text).
    moveOffsetsTo(Math.max(startOffset + delta, 0), Math.max(endOffset + delta, 0)).
    focus().apply();
};

function getLetterMarks(state) { // eslint-disable-line
  const { startOffset, endOffset } = state;
  let resultMarks = [];

  if (startOffset === endOffset) {
    if (startOffset === 0 || startOffset >= state.customCharacters.size) {
      return [];
    }

    const marksPrev = state.customCharacters.get(startOffset - 1).marks.toArray();
    const marksPrevArray = [];
    for (let i = 0; i < marksPrev.length; i++) {
      marksPrevArray.push(marksPrev[i].type);
    }
    const marksNext = state.customCharacters.get(startOffset).marks.toArray();
    for (let i = 0; i < marksNext.length; i++) {
      const currMark = marksNext[i].type;
      if (marksPrevArray.indexOf(currMark) !== -1) {
        resultMarks.push(currMark);
      }
    }
  } else {
    if (hasMultiLineSelection(state)) {
      return [];
    }

    const startMarks = state.customCharacters.get(startOffset).marks.toArray();
    for (let i = 0; i < startMarks.length; i++) {
      resultMarks.push(startMarks[i].type);
    }

    let currOffset = startOffset + 1;
    while (resultMarks.length > 0 && currOffset < endOffset) {
      const tmpMarks = [];
      const currMarks = state.customCharacters.get(currOffset).marks.toArray();
      for (let i = 0; i < currMarks.length; i++) {
        const currMark = currMarks[i].type;
        if (resultMarks.indexOf(currMark) !== -1) {
          tmpMarks.push(currMark);
        }
      }
      resultMarks = tmpMarks;
      currOffset++
    }
  }

  return resultMarks;
}

/**
 * Has text wrapped italic markdown tokens
 *
 * @param state - editor state
 */
export const hasItalicMarkdown = state => {
  const letterMarks = getLetterMarks(state);
  return letterMarks.indexOf('italic') !== -1;
};

/**
 * Wrap text italic with markdown token
 *
 * @param state - editor state
 */
export const wrapItalicMarkdown = state => {
  const { startOffset, endOffset } = state;
  let t = state.transform();
  if (startOffset === endOffset) {
    const text = '';
    t.insertText('_' + text + '_').
    move(-1).
    extend(text.length * -1);
  } else {
    t.wrapText('_', '_');
  }
  return t.focus().apply();
};

/**
 * Unwrap text with italic markdown token
 *
 * @param state - editor state
 */
export const unwrapItalicMarkdown = state => {
  return unwrapText({ state, markType: 'italic' });
};

/**
 * Has text wrapped with bold markdown tokens
 *
 * @param state - editor state
 */
export const hasBoldMarkdown = state => {
  const letterMarks = getLetterMarks(state);
  return letterMarks.indexOf('bold') !== -1;
};

/**
 * Wrap text with bold markdown tokens
 *
 * @param state - editor state
 */
export const wrapBoldMarkdown = state => {
  const { startOffset, endOffset } = state;
  let t = state.transform();
  if (startOffset === endOffset) {
    const text = '';
    t.insertText('**' + text + '**').
    move(-2).
    extend(text.length * -1);
  } else {
    t.wrapText('**', '**');
  }
  return t.focus().apply();
};

/**
 * Unwrap text with bold markdown tokens
 *
 * @param state - editor state
 */
export const unwrapBoldMarkdown = state => {
  return unwrapText({ state, markType: 'bold' });
};

/**
 * Has wrap text with strikethrough markdown tokens
 *
 * @param state - editor state
 */
export const hasStrikethroughMarkdown = state => {
  const letterMarks = getLetterMarks(state);
  return letterMarks.indexOf('strikethrough') !== -1;
};

/**
 * Wrap text with strikethrough markdown tokens
 *
 * @param state
 */
export const wrapStrikethroughMarkdown = state => {
  const { startOffset, endOffset } = state;
  let t = state.transform();
  if (startOffset === endOffset) {
    const text = '';
    t.insertText('~~' + text + '~~').
    move(-2).
    extend(text.length * -1)
  } else {
    t.wrapText('~~', '~~');
  }
  return t.focus().apply();
};

/**
 * Unwrap text with strike-throught markdown tokens
 *
 * @param state - editor state
 */
export const unwrapStrikethroughMarkdown = state => {
  return unwrapText({ state, markType: 'strikethrough' });
};

/**
 * Unwrap text with OL markdown token
 *
 * @param state - editor state
 */
export const unwrapOrderedListMarkdown = state => {
  let currLine = getCurrentLine(state);
  const result = olRegExp.exec(currLine);
  const length = result[0].length;
  return unwrapBlock(length, state);
};

export const unwrapUnorderedListMarkdown = state => {
  let currLine = getCurrentLine(state);
  const result = ulRegExp.exec(currLine);
  const length = result[0].length;
  return unwrapBlock(length, state);
};

/**
 * Wrap text with link markdown tokens
 *
 * @param state - editor state
 */
export const wrapLinkMarkdown = state => {
  const { startOffset, endOffset } = state;
  const t = state.transform();
  const url = 'http://example.com';
  if (startOffset === endOffset) {
    const text = `[link text](${url})`;
    t.insertText(text).move((text.length - 1) * -1).extend(text.length - 2);
  } else {
    t.wrapText('[', `](${(url)})`).moveOffsetsTo(endOffset + 3, endOffset + 3 + url.length)
  }
  return t.focus().apply();
};

export const hasMultiLineSelection = state => {
  const { startOffset, endOffset, focusText } = state;
  const text = focusText.text;
  const startPos = startOffset - (text[startOffset] === '\n' ? 1 : 0);
  const endPos = endOffset - (text[endOffset] === '\n' ? 1 : 0);
  return text.lastIndexOf('\n', startPos) !== text.lastIndexOf('\n', endPos);
};

/**
 * Check is the current state selected as multi line
 *
 * @param startKey - start selection key in current editor state
 * @param endKey - end selection key in current editor state
 */

export const hasUnorderedListMarkdown = hasBlock.bind(null, ulRegExp);
export const hasOrderedListMarkdown = hasBlock.bind(null, olRegExp);
export const hasHeaderOneMarkdown = hasBlock.bind(null, h1RegExp);
export const hasHeaderTwoMarkdown = hasBlock.bind(null, h2RegExp);
export const hasHeaderThreeMarkdown = hasBlock.bind(null, h3RegExp);
export const hasHeaderFourMarkdown = hasBlock.bind(null, h4RegExp);
export const hasHeaderFiveMarkdown = hasBlock.bind(null, h5RegExp);
export const hasHeaderSixMarkdown = hasBlock.bind(null, h6RegExp);

export const unwrapHeaderOneMarkdown = unwrapBlock.bind(null, '# '.length);
export const unwrapHeaderTwoMarkdown = unwrapBlock.bind(null, '## '.length);
export const unwrapHeaderThreeMarkdown = unwrapBlock.bind(null, '### '.length);
export const unwrapHeaderFourMarkdown = unwrapBlock.bind(null, '#### '.length);
export const unwrapHeaderFiveMarkdown = unwrapBlock.bind(null, '##### '.length);
export const unwrapHeaderSixMarkdown = unwrapBlock.bind(null, '###### '.length);

export const wrapUnorderedListMarkdown = wrapBlock.bind(null,
  [olRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '* ');
export const wrapOrderedListMarkdown = wrapBlock.bind(null,
  [ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '1. ');
export const wrapHeaderOneMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '# ');
export const wrapHeaderTwoMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h1RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '## ');
export const wrapHeaderThreeMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h1RegExp, h2RegExp, h4RegExp, h5RegExp, h6RegExp], '### ');
export const wrapHeaderFourMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h5RegExp, h6RegExp], '#### ');
export const wrapHeaderFiveMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h6RegExp], '##### ');
export const wrapHeaderSixMarkdown = wrapBlock.bind(null,
  [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp], '###### ');
