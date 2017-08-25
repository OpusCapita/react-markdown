// common reg expressions
const olRegExp = /^ *[0-9]+\.\s/m;
const ulRegExp = /^ *[\*\+\-]\s/m;
const h1RegExp = /^#\s/m;
const h2RegExp = /^##\s/m;
const h3RegExp = /^###\s/m;
const h4RegExp = /^####\s/m;
const h5RegExp = /^#####\s/m;
const h6RegExp = /^######\s/m;

const regExpMark = {
  all: /\*{1,4}|_{1,4}|~~|\n/g,
};

const lengths = {
  bold: 2,
  italic: 1,
  'strike-through': 2,
  all: 3,
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

  function clearAllMarksStates() {
    for (let token in markState) {
      if (markState[token]) {
        marks[token].pop();
        markState[token] = false;
      }
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    let tokenData = tokens[i];
    const token = tokenData.token;
    const position = tokenData.position;

    if (token === '\n') {
      clearAllMarksStates();
    // Current token is ~~
    // Or Current token is a closing token. Current position is between two equal marks.
    } else if (token === '~~' || markState[token]) {
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
    markLength = lengths.bold;
  } else if (markType === 'italic') {
    mark1 = '_';
    mark2 = '*';
    markLength = lengths.italic;
  }
  if (markType === 'strike-through') {
    markLength = lengths['strike-through'];
    positionsData = [{ mark: '~~', allLength: markLength }];
  } else {
    positionsData = [
      { mark: mark1, allLength: markLength },
      { mark: mark2, allLength: markLength },
      { mark: '___', allLength: lengths.all },
      { mark: '***', allLength: lengths.all },
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
  let afterState = null;
  let length = 0;
  for (let i = 0, k = matchRules.length; i < k; i++) {
    const result = matchRules[i].exec(currLine);
    if (result) {
      length = result[0].length;
      afterState = unwrapBlock(length, state);
      break;
    }
  }

  if (!afterState) {
    afterState = state;
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
    if (startOffset === 0) {
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
    while (resultMarks.length > 0 && currOffset <= endOffset) {
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
  // const letterMarks = getLetterMarks(state);
  // return letterMarks.indexOf('italic') !== -1;

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
  // const letterMarks = getLetterMarks(state);
  // return letterMarks.indexOf('bold') !== -1;

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
  // const letterMarks = getLetterMarks(state);
  // return letterMarks.indexOf('strikethrough') !== -1;

  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  const allPositions = getAllPositions(focusedText);

  return checkOneMark({
    positions: allPositions['~~'],
    startOffset,
    endOffset,
    markLength: lengths['strike-through']
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
// export const hasMultiLineSelection = ({ selection: { startKey, endKey } }) => startKey !== endKey;

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
