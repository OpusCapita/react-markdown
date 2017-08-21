// common reg expressions
const olRegExp = /^[0-9]+\.\s/m;
const ulRegExp = /^\*\s/m;
const h1RegExp = /^#\s/m;
const h2RegExp = /^##\s/m;
const h3RegExp = /^###\s/m;
const h4RegExp = /^####\s/m;
const h5RegExp = /^#####\s/m;
const h6RegExp = /^######\s/m;

const regExpMark = {
  '*': /\*/g,
  '**': /\*\*/g,
  '***': /\*\*\*/g,
  '_': /_/g,
  '__': /__/g,
  '___': /___/g,
  '~~': /~~/g,
  all: /\*{1,4}|_{1,4}|~~/g,
  // all: /\*{1,4}|_{1,4}|~~|\(|\)|\[|\]|\{|\}/g, // will use this code in future
};

const BOLD_LENGTH = 2;
const ITALIC_LENGTH = 1;
const ALL_LENGTH = 3;
const STRIKETHROUGH_LENGTH = 2;
const lengths = {
  bold: BOLD_LENGTH,
  italic: ITALIC_LENGTH,
  'strike-through': STRIKETHROUGH_LENGTH
};

function getMarks() {
  return {
    '*': [],
    '**': [],
    '***': [],
    '_': [],
    '__': [],
    '___': [],
    '~~': [],
  };
}

function getMarkState() {
  return {
    '*': false,
    '**': false,
    '***': false,
    '_': false,
    '__': false,
    '___': false,
    '~~': false,
  };
}

function getTokensFromText(text) {
  const tokens = [];
  let tokenHalf = null; // Next half of long token '____' or '****'
  const re = regExpMark.all;
  let res = re.exec(text); // Get first token

  while (res) {
    let token;
    if (tokenHalf) {
      token = tokenHalf.token;
      res.index = tokenHalf.index;
      tokenHalf = null;
    } else {
      token = res[0];

      if (token === '____' || token === '****') { // Create two tokens from it
        token = token.substr(0, 2);
        tokenHalf = { token: token, index: res.index + 2 };
      }
    }
    tokens.push({ token, position: res.index });

    if (!tokenHalf) {
      res = re.exec(text); // Get next token
    }
  }
  return tokens;
}

/**
 * Function getAllPositions returns all positions of the bold and italic marks in line
 *
 * @param text
 * @returns {{}}
 */

function getAllPositions(text) {
  let marks = getMarks();
  let markState = getMarkState();
  const tokens = getTokensFromText(text);

  function addTokenPos(token, pos) {
    if (markState[token]) {
      for (let mark in markState) {
        if (mark !== token && markState[mark]) {
          const markPos = marks[mark][marks[mark].length - 1];
          const tokenPrevPos = marks[token][marks[token].length - 1];
          if (tokenPrevPos < markPos) {
            markState[mark] = false;
            marks[mark].pop();
          }
        }
      }
    }

    markState[token] = !markState[token];
    marks[token].push(pos);
  }

  function addTokenPositions(token1, token2, pos11, pos12, pos2) {
    marks[token1].push(pos11, pos12);
    addTokenPos(token2, pos2);
  }

  /**
   * Method saveTokenAfterLong divide previous long token to two tokens
   *
   * Example 1:
   *  token === '*', previous token === '***'  =>  Divide previous token to '**', '*' then save them.
   *  After it save token '*'
   *
   * Example 2:
   *  token === '__', previous token === '___'  =>  Divide previous token to '_', '__' then save them.
   *  After it save token '__'
   *
   * @param token
   * @param currPos
   * @param mark
   */

  function saveTokenAfterLong({ token, currPos, mark }) {
    const mark2 = mark + mark; // _ -> __; * -> **
    const mark3 = mark2 + mark; // _ -> ___; * -> *** - Long mark
    markState[mark3] = false;
    const longPos = marks[mark3].pop();
    if (token === mark) {
      addTokenPositions(token, mark2, longPos + 2, currPos, longPos);
    } else {
      addTokenPositions(token, mark, longPos + 1, currPos, longPos);
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    let tokenData = tokens[i];
    const token = tokenData.token;
    const position = tokenData.position;

    // Current token is ~~
    // Or Current token is a closing token. Current position is between two equal marks.
    if (token === '~~' || markState[token]) {
      addTokenPos(token, position);
    } else {
      if (token === '___' || token === '***' || // Current token  is long token or
        (token === '_' || token === '__') && !markState['___'] || // Previous token is not long token with same mark
        (token === '*' || token === '**') && !markState['***']) {
        addTokenPos(token, position); // Current token is an opening token
      } else { // Previous token is long token with same mark
        if (token === '_' || token === '__') { // Previous token is '___'
          saveTokenAfterLong({ token, currPos: position, mark: '_' });
        } else { // Previous token is '***'
          saveTokenAfterLong({ token, currPos: position, mark: '*' });
        }
      }
    }
  }
  return marks;
}

function withinMark(positions, currPosition, markLength) {
  for (let i = 0; i < positions.length - 1; i += 2) {
    if (positions[i] < currPosition && currPosition < positions[i + 1] + markLength) {
      return i;
    }
  }

  return -1;
}

function selectionWithinMarks(positions, pos1, pos2, markLength) {
  for (let i = 0; i < positions.length - 1; i += 2) {
    if (positions[i] <= pos1 && pos1 <= positions[i + 1] + markLength &&
      positions[i] <= pos2 && pos2 <= positions[i + 1] + markLength) {
      return i;
    }
  }

  return -1;
}

function checkOneMark({ positions, startOffset, endOffset, markLength }) {
  return startOffset !== endOffset &&
    selectionWithinMarks(positions, startOffset, endOffset, markLength) !== -1 ||
    startOffset === endOffset &&
    withinMark(positions, startOffset, markLength) !== -1;
}

function getPositionsData(markType) {
  let positionsData, mark1, mark2, markLength;
  if (markType === 'bold') {
    mark1 = '__';
    mark2 = '**';
    markLength = BOLD_LENGTH;
  } else if (markType === 'italic') {
    mark1 = '_';
    mark2 = '*';
    markLength = ITALIC_LENGTH;
  }
  if (markType === 'strike-through') {
    markLength = STRIKETHROUGH_LENGTH;
    positionsData = [{ mark: '~~', allLength: markLength }];
  } else {
    positionsData = [
      { mark: mark1, allLength: markLength },
      { mark: mark2, allLength: markLength },
      { mark: '___', allLength: ALL_LENGTH },
      { mark: '***', allLength: ALL_LENGTH },
    ];
  }
  return positionsData;
}

function hasMark({ focusedText, markType, startOffset, endOffset }) {
  const positionsData = getPositionsData(markType);
  const allPositions = getAllPositions(focusedText);
  for (let i = 0; i < positionsData.length; i++) {
    const condition = checkOneMark({
      positions: allPositions[positionsData[i].mark],
      startOffset,
      endOffset,
      markLength: positionsData[i].allLength
    });
    if (condition) {
      return true;
    }
  }

  return false;
}

function unwrapFromMark({ state, positions, markLength, allLength }) {
  const { startOffset, endOffset, focusText } = state;
  allLength = allLength || markLength; // eslint-disable-line
  let numPos = startOffset === endOffset ?
    withinMark(positions, startOffset, allLength) :
    selectionWithinMarks(positions, startOffset, endOffset, allLength);
  if (numPos !== -1) {
    let delta1 = startOffset - positions[numPos];
    let delta2 = positions[numPos + 1] - startOffset - markLength;
    let startPos = startOffset - markLength;
    startPos = startPos < positions[numPos] ? positions[numPos] : startPos;
    let endPos = endOffset - markLength;
    let maxNewEndPos = positions[numPos + 1] + allLength - markLength;
    endPos -= endOffset > maxNewEndPos ? endOffset - maxNewEndPos : 0;
    return state.transform().move(-delta1). // Move cursor to an opening mark
    removeTextByKey(focusText.key, startOffset - delta1, markLength). // Remove an opening mark
    move(delta1 + delta2). // Move cursor to a closing mark
    removeTextByKey(focusText.key, startOffset + delta2, markLength). // Remove a closing mark
    moveOffsetsTo(startPos, endPos).
    focus().apply();
  }
  return -1;
}

function unwrapText({ state, markType }) {
  const { focusText } = state;
  const positionsData = getPositionsData(markType);
  const allPositions = getAllPositions(focusText.text);
  for (let i = 0; i < positionsData.length; i++) {
    const markPositions = allPositions[positionsData[i].mark];
    const res = unwrapFromMark({
      state,
      positions: markPositions,
      markLength: lengths[markType],
      allLength: positionsData[i].allLength
    });
    if (res !== -1) {
      return res;
    }
  }

  return state;
}

function getCurrentLine(state) {
  const { startOffset, endOffset, focusText } = state;
  const text = focusText.text;
  const prevLineEnd = text.lastIndexOf('\n', startOffset);

  return (prevLineEnd === -1 ? text : text.substr(prevLineEnd + 1)).split('\n', 1)[0];
}

/**
 * Has block selected
 *
 * @param regExp - match regexp
 * @param state - editor state
 */
function hasBlock_(regExp, state) {
  let currLine = getCurrentLine(state);
  return regExp.test(currLine);
}

/**
 * Has block selected
 *
 * @param regExp - match regexp
 * @param state - editor state
 */
// const hasBlock = function(regExp, state) {
//   const { focusText } = state;
//   const focusedText = focusText.text;
//   return regExp.test(focusedText);
// };

/**
 * Unwrap block
 *
 * @param removedLength - first length should be removed
 * @param state - editor state
 */
const unwrapBlock = function(removedLength, state) {
  const { startOffset, endOffset } = state;
  return state.transform().
  moveOffsetsTo(0).
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
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  const t = state.transform().moveOffsetsTo(0);
  let length = 0;
  for (let i = 0, k = matchRules.length; i < k; i++) {
    const result = matchRules[i].exec(focusedText);
    if (result) {
      length = result[0].length;
      t.deleteForward(length);
      break;
    }
  }
  return t.insertText(text).
  moveOffsetsTo(Math.max(startOffset + text.length - length, 0), Math.max(endOffset + text.length - length, 0)).
  focus().apply();
};

/**
 * Has text wrapped italic markdown tokens
 *
 * @param state - editor state
 */
export const hasItalicMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  return hasMark({ focusedText, markType: 'italic', startOffset, endOffset });
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
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  return hasMark({ focusedText, markType: 'bold', startOffset, endOffset });
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
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  const allPositions = getAllPositions(focusedText);

  return checkOneMark({
    positions: allPositions['~~'],
    startOffset,
    endOffset,
    markLength: STRIKETHROUGH_LENGTH
  });
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
 * Unwrap text with strikethrought markdown tokens
 *
 * @param state - editor state
 */
export const unwrapStrikethroughMarkdown = state => {
  return unwrapText({ state, markType: 'strike-through' });
};

/**
 * Unwrap text with OL markdown token
 *
 * @param state - editor state
 */
export const unwrapOrderedListMarkdown = state => {
  const { focusText } = state;
  const focusedText = focusText.text;
  const result = olRegExp.exec(focusedText);
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

/**
 * Check is the current state selected as multi line
 *
 * @param startKey - start selection key in current editor state
 * @param endKey - end selection key in current editor state
 */
export const hasMultiLineSelection = ({ selection: { startKey, endKey } }) => startKey !== endKey;

export const hasUnorderedListMarkdown = hasBlock_.bind(null, ulRegExp);
export const hasOrderedListMarkdown = hasBlock_.bind(null, olRegExp);
export const hasHeaderOneMarkdown = hasBlock_.bind(null, h1RegExp);
export const hasHeaderTwoMarkdown = hasBlock_.bind(null, h2RegExp);
export const hasHeaderThreeMarkdown = hasBlock_.bind(null, h3RegExp);
export const hasHeaderFourMarkdown = hasBlock_.bind(null, h4RegExp);
export const hasHeaderFiveMarkdown = hasBlock_.bind(null, h5RegExp);
export const hasHeaderSixMarkdown = hasBlock_.bind(null, h6RegExp);
export const unwrapHeaderOneMarkdown = unwrapBlock.bind(null, '# '.length);
export const unwrapHeaderTwoMarkdown = unwrapBlock.bind(null, '## '.length);
export const unwrapHeaderThreeMarkdown = unwrapBlock.bind(null, '### '.length);
export const unwrapHeaderFourMarkdown = unwrapBlock.bind(null, '#### '.length);
export const unwrapHeaderFiveMarkdown = unwrapBlock.bind(null, '##### '.length);
export const unwrapHeaderSixMarkdown = unwrapBlock.bind(null, '###### '.length);
export const wrapUnorderedListMarkdown = wrapBlock.bind(null,
  [olRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '* ');
export const unwrapUnorderedListMarkdown = unwrapBlock.bind(null, '* '.length);
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
