// common reg expressions
const olRegExp = /^(\s*)([0-9]+)(\.|\))\s/;
const ulRegExp = /^\s*(\*|\+|-)\s/;
const h1RegExp = /^#\s/;
const h2RegExp = /^##\s/;
const h3RegExp = /^###\s/;
const h4RegExp = /^####\s/;
const h5RegExp = /^#####\s/;
const h6RegExp = /^######\s/;

const MATCH_SINGLE_RULE = {
  ul: ulRegExp,
  ol: olRegExp,
};

const MATCH_RULES = {
  ul: [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
  ol: [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
  header: [
    null,
    [olRegExp, ulRegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
    [olRegExp, ulRegExp, h1RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
    [olRegExp, ulRegExp, h1RegExp, h2RegExp, h4RegExp, h5RegExp, h6RegExp],
    [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h5RegExp, h6RegExp],
    [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h6RegExp],
    [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp],
  ]
};

const EMPHASIS_NAMES = [
  'bold', 'italic', 'strikethrough'
];

export const EMPHASIS = {
  bold: '**',
  italic: '_',
  strikethrough: '~~',
};

const EMPHASIS_ALL = {
  bold: ['**', '__'],
  italic: ['_', '*'],
  strikethrough: ['~~'],
};

/**
 * Check is the current state selected as multi line
 *
 * @param startKey - start selection key in current editor state
 * @param endKey - end selection key in current editor state
 */
export const hasMultiLineSelection = ({ selection: { startKey, endKey } }) => startKey !== endKey;

/**
 * Has the mark on a char
 *
 * @param character
 * @param mark
 * @returns {boolean}
 */
function hasMarkOnChar(character, mark) {
  let arrChars = character.marks.toJS();
  let marksSize = arrChars.length;
  for (let i = 0; i < marksSize; i++) {
    if (arrChars[i].type === mark) {
      return true;
    }
  }
  return false;
}

/**
 * The text has a wrapper in emphasis
 *
 * @param mark
 * @param state
 * @returns {boolean}
 */
function hasEmphasis(mark, state) {
  let { startKey, endKey, startOffset, endOffset, texts } = state;

  if (startKey === endKey) {
    let focusText = texts.get(0).text;
    let textLength = focusText.length;
    if (texts.get(0).charsData) {
      let characters = texts.get(0).charsData.characters;
      // not selection
      if (startOffset === endOffset) {
        // string's edge
        if (startOffset === 0 || startOffset === textLength) {
          return false;
        } else {
          const prevChar = characters.get(startOffset - 1);
          const currChar = characters.get(startOffset);
          const hasPrevMark = hasMarkOnChar(prevChar, mark);
          const hasCurrMark = hasMarkOnChar(currChar, mark);
          // between character's marks
          if (hasPrevMark && hasCurrMark) {
            return true;
            // between pairs of markers
          } else if ((mark === 'bold' || mark === 'strikethrough') &&
            startOffset > 1 && startOffset < textLength - 1) {
            let leftPart = focusText.substr(startOffset - 2, 2);
            let rightPart = focusText.substr(startOffset, 2);
            if (leftPart === rightPart &&
              (mark === 'bold' && (leftPart === '**' || leftPart === '__') ||
                mark === 'strikethrough' && leftPart === '~~')) {
              return true;
            }
            // between italic markers and not bold's edge
          } else if (mark === 'italic' && prevChar.text === currChar.text &&
            (currChar.text === '_' || currChar.text === '*') && !hasPrevMark && !hasCurrMark &&
            (!(hasMarkOnChar(prevChar, 'bold') && hasMarkOnChar(currChar, 'bold')) &&
              (startOffset === 1 || startOffset === focusText.length - 1 ||
                !hasMarkOnChar(characters.get(startOffset - 2), 'bold') &&
                !hasMarkOnChar(characters.get(startOffset + 1), 'bold')))) {
            return true;
          }
        }
        // selection
      } else {
        for (let i = startOffset; i < endOffset; i++) {
          if (!hasMarkOnChar(characters.get(i), mark)) {
            return false;
          }
        }
        return true;
      }
    }
  }

  return false;
}

export const getLeftEmphEdge = (accent, characters, startPos) => {
  let leftEdge = -1;
  for (let i = startPos - 1; i >= 0; i--) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      leftEdge = i + 1;
      break
    }
  }
  return leftEdge < 0 ? 0 : leftEdge;
};

export const getRightEmphEdge = (accent, characters, startPos, maxPos) => {
  let rightEdge = -1;
  for (let i = startPos + 1; i < maxPos; i++) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      rightEdge = i - 1;
      break
    }
  }
  return rightEdge < 0 ? maxPos - 1 : rightEdge;
};

export const getLeftSelectionEdgeData = ({ accent, characters, startOffset }) => {
  let leftInChar = characters.get(startOffset);
  let hasLeftInMark = hasMarkOnChar(leftInChar, accent);
  let leftOutChar = null;
  let hasLeftOutMark = false;
  if (startOffset > 0) {
    leftOutChar = characters.get(startOffset - 1);
    hasLeftOutMark = hasMarkOnChar(leftOutChar, accent);
  }
  let hasLeftOnEmphasis = hasLeftInMark || startOffset > 0 && hasLeftOutMark;
  return {
    leftInChar,
    hasLeftInMark,
    leftOutChar,
    hasLeftOutMark,
    hasLeftOnEmphasis
  }
};

export const getRightSelectionEdgeData = ({ accent, characters, endOffset, text }) => {
  let rightInChar = characters.get(endOffset - 1);
  let hasRightInMark = hasMarkOnChar(rightInChar, accent);
  let rightOutChar = null;
  let hasRightOutMark = false;
  if (endOffset < text.length) {
    rightOutChar = characters.get(endOffset);
    hasRightOutMark = hasMarkOnChar(rightOutChar, accent);
  }
  let hasRightOnEmphasis = hasRightInMark || endOffset < text.length && hasRightOutMark;
  return {
    rightInChar,
    hasRightInMark,
    rightOutChar,
    hasRightOutMark,
    hasRightOnEmphasis
  }
};

function delInternalMarkers({ change, focusKey, characters, accent, startPos, endPos }) {
  const marker = EMPHASIS[accent];
  let markerLength = marker.length;
  let accentEdgePositions = [];
  let hasAccents = [];
  hasAccents[startPos] = hasMarkOnChar(characters.get(startPos), accent);
  for (let i = startPos; i < endPos - 1; i++) {
    hasAccents[i + 1] = hasMarkOnChar(characters.get(i + 1), accent);
    if (hasAccents[i] !== hasAccents[i + 1]) {
      if (hasAccents[i]) {
        accentEdgePositions.push(i - markerLength + 1);
      } else {
        accentEdgePositions.push(i + 1);
      }
    }
  }
  accentEdgePositions.reverse();
  for (let i = 0; i < accentEdgePositions.length; i++) {
    change.removeTextByKey(focusKey, accentEdgePositions[i], markerLength);
  }
  return accentEdgePositions.length;
}

function delInternalMarkersBind({ change, focusKey, characters, accent }) {
  return function({ startPos, endPos }) {
    return delInternalMarkers({
      change, focusKey, characters, accent, startPos, endPos
    });
  }
}

/**
 * Both selection edges is on emphasis, delete all internal markers
 *
 * @param change
 * @param focusKey
 * @param characters
 * @param text
 * @param accent
 * @param startOffset
 * @param endOffset
 * @param markerLength
 */
function unionEmphasis({ change, focusKey, characters, accent, text, startOffset, endOffset, markerLength }) {
  let leftEmphEdge = getLeftEmphEdge(accent, characters, startOffset);
  let rightEmphEdge = getRightEmphEdge(accent, characters, endOffset - 1, text.length);
  let leftMarker = text.substr(leftEmphEdge, markerLength);
  let rightMarkerPos = rightEmphEdge - markerLength;
  let rightMarker = text.substr(rightMarkerPos, markerLength);
  let delCount = delInternalMarkers({
    change,
    focusKey,
    characters,
    accent,
    startPos: leftEmphEdge + markerLength,
    endPos: rightEmphEdge - markerLength
  });
  rightMarkerPos -= delCount * markerLength - 1;
  if (leftMarker !== rightMarker) {
    change.removeTextByKey(focusKey, rightMarkerPos, markerLength).
    insertTextByKey(focusKey, rightMarkerPos, leftMarker);
  }
  return change;
}

/**
 * Wrap text with accent
 *
 * @param accent
 * @param state
 */
function wrapEmphasis(accent, state) {
  const marker = EMPHASIS[accent];
  let markerLength = marker.length;
  const { startOffset, endOffset, focusText, texts } = state;
  const { text } = focusText;
  const focusKey = focusText.key;
  let change = state.change();

  // #1 no selection
  if (startOffset === endOffset) {
    change.insertText(`${marker}${marker}`).
    move(-markerLength);

    // selection (this edge is selection edge)
  } else {
    let characters = texts.get(0).charsData.characters;
    let delMarkers = delInternalMarkersBind({ change, focusKey, characters, accent });
    const {
      hasLeftOnEmphasis
    } = getLeftSelectionEdgeData({ accent, characters, startOffset });
    const {
      hasRightOnEmphasis
    } = getRightSelectionEdgeData({ accent, characters, endOffset, text });

    if (hasLeftOnEmphasis) {
      if (hasRightOnEmphasis) {
        // #2 both edges on emphasis, delete all internal markers
        change = unionEmphasis({
          change, focusKey, characters, text, accent, startOffset, endOffset, markerLength
        });
      } else {
        // #3 left edge on emphasis, right edge beyond markers
        let leftEmphEdge = getLeftEmphEdge(accent, characters, startOffset);
        let leftMarker = text.substr(leftEmphEdge, markerLength);
        delMarkers({ startPos: leftEmphEdge, endPos: endOffset - 1 });
        change.insertTextByKey(focusKey, endOffset - 1, leftMarker);
      }
    } else {
      if (hasRightOnEmphasis) {
        // #4 left edge beyond markers, right edge on emphasis
        let rightEmphEdge = getRightEmphEdge(accent, characters, endOffset - 1, text.length);
        let rightMarker = text.substr(rightEmphEdge - markerLength + 1, markerLength);
        delMarkers({ startPos: startOffset, endPos: rightEmphEdge });
        change.insertTextByKey(focusKey, startOffset, rightMarker);
      } else {
        // #5 both edges beyond markers
        // delete all internal markers, wrap selection in markers
        delMarkers({ startPos: startOffset, endPos: endOffset });
        change.wrapText(marker, marker).focus();
      }
    }
  }

  change.focus();
  return change.state;
}

/**
 * Unwrap text from accent
 *
 * @param {string} accent
 * @param state - editor state
 */
function unwrapEmphasis(accent, state) {
  let markerLength = EMPHASIS[accent].length;
  const { startOffset, endOffset, focusText, texts } = state;
  const change = state.change();
  const focusKey = focusText.key;
  let characters = texts.get(0).charsData.characters;
  const { text } = focusText;
  const leftEmphEdge = getLeftEmphEdge(accent, characters, startOffset);
  const rightEmphEdge = getRightEmphEdge(accent, characters, startOffset, text.length);
  const marker = text.substr(leftEmphEdge, markerLength);

  // no selection
  if (startOffset === endOffset) {
    if (startOffset > markerLength - 1 && startOffset < text.length - markerLength + 1) {
      let leftMarker = text.substr(startOffset - markerLength, markerLength);
      let rightMarker = text.substr(startOffset, markerLength);
      // #1 the cursor is wrapped in markers, delete markers
      if (leftMarker === rightMarker && EMPHASIS_ALL[accent].indexOf(leftMarker) !== -1) {
        change.removeTextByKey(focusKey, endOffset, markerLength).
        removeTextByKey(focusKey, startOffset - markerLength, markerLength).focus();
        return change.state;
      }
    }

    // #2 the cursor on a marker, do nothing
    if (leftEmphEdge < startOffset && startOffset <= leftEmphEdge + markerLength ||
      rightEmphEdge - markerLength + 1 <= startOffset && startOffset < rightEmphEdge + 1) {
      return state

      // #3 the between markers, add markers to the place of the cursor
    } else {
      change.insertText(`${marker}${marker}`).move(-markerLength).focus();
      return change.state;
    }

    // selection
  } else {
    // #4 the selection on the left edge, do nothing
    if ((leftEmphEdge === startOffset || leftEmphEdge + 1 === startOffset) &&
      leftEmphEdge + 1 === endOffset || leftEmphEdge + markerLength === endOffset) {
      return state
    }

    // #5 the selection on the right edge, do nothing
    if ((rightEmphEdge - markerLength + 1 === startOffset ||
        rightEmphEdge - markerLength + 2 === startOffset) &&
      (rightEmphEdge === endOffset || rightEmphEdge + 1 === endOffset)) {
      return state
    }

    // #6 the selection between markers, wrap selection in additional markers
    // (between additional markers there is no current emphasis)
    if (leftEmphEdge + markerLength < startOffset && endOffset < rightEmphEdge - markerLength + 1) {
      change.wrapText(marker, marker).focus();
      return change.state;
    }

    // #7 the selection on markers, delete markers
    if (leftEmphEdge <= startOffset && startOffset <= leftEmphEdge + markerLength &&
      rightEmphEdge - markerLength + 1 <= endOffset && endOffset <= rightEmphEdge + 1) {
      change.removeTextByKey(focusKey, rightEmphEdge - markerLength + 1, markerLength).
      removeTextByKey(focusKey, leftEmphEdge, markerLength).focus();
      return change.state;
    }

    // #8 startOffset on left marker, endOffset between markers,
    // remove accent from the left part of a wrapper
    if (leftEmphEdge <= startOffset && startOffset <= leftEmphEdge + markerLength) {
      change.insertTextByKey(focusKey, endOffset, marker).
      removeTextByKey(focusKey, leftEmphEdge, markerLength).
      moveOffsetsTo(leftEmphEdge, endOffset - markerLength).focus();
      return change.state;
    }

    // #9 startOffset between markers, endOffset on right marker,
    // remove accent from the right part of a wrapper
    change.removeTextByKey(focusKey, rightEmphEdge - markerLength + 1, markerLength).
    insertTextByKey(focusKey, startOffset, marker).
    moveOffsetsTo(startOffset + markerLength, rightEmphEdge + 1).focus();
    return change.state;
  }
}

/**
 * Has block selected
 *
 * @param regExp - match regexp
 * @param state - editor state
 */
function hasBlock(regExp, state) {
  const { focusText } = state;
  const focusedText = focusText.text;
  return regExp.test(focusedText);
}

/**
 * Wrap block
 *
 * @param matchRules - list of regexp
 * @param text - marker of the block
 * @param state - editor state
 */
function wrapBlock(matchRules, text, state) {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  const change = state.change();
  change.moveOffsetsTo(0);
  let length = 0;
  for (let i = 0, k = matchRules.length; i < k; i++) {
    const result = matchRules[i].exec(focusedText);
    if (result) {
      length = result[0].length;
      change.deleteForward(length);
      break;
    }
  }
  const startPos = Math.max(startOffset + text.length - length, 0);
  const endPos = Math.max(endOffset + text.length - length, 0);
  change.insertText(text).moveOffsetsTo(startPos, endPos).focus();

  return change.state;
}

/**
 * Wrap block
 *
 * @param matchRules - list of regexp
 * @param text - marker of the block
 * @param change - editor change
 * @returns {Object} - state
 */
const wrapBlockForChange = function(matchRules, text, change) {
  const { startOffset, endOffset, focusText } = change.state;
  const focusedText = focusText.text;
  change.moveOffsetsTo(0);
  let length = 0;
  for (let i = 0, k = matchRules.length; i < k; i++) {
    const result = matchRules[i].exec(focusedText);
    if (result) {
      length = result[0].length;
      change.deleteForward(length);
      break;
    }
  }
  const startPos = Math.max(startOffset + text.length - length, 0);
  const endPos = Math.max(endOffset + text.length - length, 0);
  change.insertText(text).moveOffsetsTo(startPos, endPos).focus();

  return change;
};

/**
 * Unwrap block
 *
 * @param removedLength - first length should be removed
 * @param change - editor change
 * @returns {Object} - change
 */
const unwrapBlockForChange = function(removedLength, change) {
  const { startOffset, endOffset } = change.state;
  const startPos = Math.max(startOffset - removedLength, 0);
  const endPos = Math.max(endOffset - removedLength, 0);
  change.moveOffsetsTo(0).deleteForward(removedLength).
  moveOffsetsTo(startPos, endPos).focus();
  return change;
};

/**
 * Unwrap block
 *
 * @param removedLength - first length should be removed
 * @param state - editor state
 */
function unwrapBlock(removedLength, state) {
  let change = state.change();
  change = unwrapBlockForChange(removedLength, change);
  return change.state;
}

/**
 * Has list selected
 *
 * @param {string} accent - list type
 * @param {Object} state - editor state
 * @param {number} numLine
 */
function hasListLine(accent, state, numLine = 0) {
  let { texts } = state;
  let text = texts.get(numLine).text;
  return MATCH_SINGLE_RULE[accent].test(text);
}

/**
 * Has list selected
 *
 * @param {string} type - list type
 * @param {Object} state - editor state
 */
function hasList(type, state) {
  if (hasMultiLineSelection(state)) {
    for (let i = 0; i < state.texts.size; i++) {
      if (!hasListLine(type, state, i)) {
        return false;
      }
    }
    return true;
  } else {
    return hasListLine(type, state)
  }
}

export const getUlMarker = function(text) {
  let res = ulRegExp.exec(text);
  if (res) {
    return res[0];
  }

  return false;
};

export const getOlNum = function(text) {
  let res = olRegExp.exec(text);
  let pref = '';
  let itemNum = 1;
  let div = '.';
  let listMarker = '';
  if (res) {
    listMarker = res[0]; // === '   2) '
    pref = res[1]; // === '   '
    itemNum = +res[2]; // === 2
    div = res[3]; // === ')'
  }

  return { pref, itemNum, div, listMarker };
};

function getTextLength(change) {
  return change.state.texts.get(0).text.length;
}

/**
 * Wrap text with list token
 *
 * @param {string} accent
 * @param state - editor state
 * @returns {Object} - state
 */
const wrapList = function(accent, state) {
  let text = accent === 'ul' ? '* ' : '1. ';
  if (hasMultiLineSelection(state)) {
    let {
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
      isBackward
    } = state.selection;
    let keys = [];
    let firstBefore, firstAfter, lastBefore, lastAfter;
    for (let i = 0; i < state.texts.size; i++) {
      keys.push(state.texts.get(i).key);
    }

    let lineText = state.texts.get(0).text;
    let pref, itemNum, div;
    if (accent === 'ul') {
      let ulMarker = getUlMarker(lineText);
      if (ulMarker) {
        text = ulMarker;
      } else {
        text = '* ';
      }
    } else {
      ({ pref, itemNum, div } = getOlNum(lineText));
    }

    let change = state.change();
    let keysLength = keys.length;
    let lastNum = keysLength - 1;
    for (let i = 0; i < keysLength; i++) {
      moveSelectionToLine(change, keys[i]);
      if (i === 0) {
        firstBefore = getTextLength(change);
      } else if (i === lastNum) {
        lastBefore = getTextLength(change);
      }
      if (i === 0 && !hasBlock(MATCH_SINGLE_RULE[accent], change.state) || i > 0) {
        text = accent === 'ul' ? text : `${pref}${itemNum}${div} `;
        change = wrapBlockForChange(MATCH_RULES[accent], text, change);// eslint-disable-line
        if (i === 0) {
          firstAfter = getTextLength(change);
        } else if (i === lastNum) {
          lastAfter = getTextLength(change);
        }
        itemNum++;
        continue;
      }
      if (i === 0) {
        firstAfter = firstBefore;
      } else if (i === lastNum) {
        lastAfter = lastBefore;
      }
      itemNum++;
    }
    change.select({
      anchorKey,
      anchorOffset: anchorOffset - firstBefore + firstAfter,
      focusKey,
      focusOffset: focusOffset - lastBefore + lastAfter,
      isFocused: true,
      isBackward
    });

    return change.state;
  } else {
    return wrapBlock(MATCH_RULES[accent], text, state);
  }
};

/**
 * Unwrap line with OL markdown token
 *
 * @param {string} accent
 * @param change - editor change
 * @returns {Object} - change
 */
export const unwrapListLineForChange = (accent, change) => {
  const { focusText } = change.state;
  const focusedText = focusText.text;
  const result = MATCH_SINGLE_RULE[accent].exec(focusedText);
  if (result) {
    const length = result[0].length;
    return unwrapBlockForChange(length, change);
  }
  return change;
};

/**
 * Unwrap line with OL markdown token
 *
 * @param {string} accent
 * @param state - editor state
 * @returns {Object} - state
 */
export const unwrapListLine = (accent, state) => {
  const change = unwrapListLineForChange(accent, state.change());
  return change.state;
};

const unwrapListCallbacks = {
  ul: unwrapListLine.bind(null, 'ul'),
  ol: unwrapListLine.bind(null, 'ol')
};

const unwrapListCallbacksForChange = {
  ul: unwrapListLineForChange.bind(null, 'ul'),
  ol: unwrapListLineForChange.bind(null, 'ol')
};

function moveSelectionToLine(change, key) {
  change.select({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    focusOffset: 0,
    isFocused: true,
    isBackward: false,
  });
}

/**
 * Unwrap text with list token
 *
 * @param {string} accent
 * @param state - editor state
 * @returns {Object} - state
 */
const unwrapList = function(accent, state) {
  if (hasMultiLineSelection(state)) {
    let {
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
      isBackward
    } = state.selection;
    let keys = [];
    let firstBefore, firstAfter, lastBefore, lastAfter;
    for (let i = 0; i < state.texts.size; i++) {
      keys.push(state.texts.get(i).key);
    }

    let change = state.change();
    let keysLength = keys.length;
    let lastNum = keysLength - 1;
    for (let i = 0; i < keysLength; i++) {
      moveSelectionToLine(change, keys[i]);
      if (i === 0) {
        firstBefore = getTextLength(change);
      } else if (i === lastNum) {
        lastBefore = getTextLength(change);
      }
      change = unwrapListCallbacksForChange[accent](change);
      if (i === 0) {
        firstAfter = getTextLength(change);
      } else if (i === lastNum) {
        lastAfter = getTextLength(change);
      }
    }
    let newAnchorOffset = anchorOffset - (isBackward ? lastBefore - lastAfter : firstBefore - firstAfter);
    let newFocusOffset = focusOffset - (isBackward ? firstBefore - firstAfter : lastBefore - lastAfter);
    change.select({
      anchorKey,
      anchorOffset: newAnchorOffset < 0 ? 0 : newAnchorOffset,
      focusKey,
      focusOffset: newFocusOffset < 0 ? 0 : newFocusOffset,
      isFocused: true,
      isBackward
    });
    return change.state;
  } else {
    return unwrapListCallbacks[accent](state);
  }
};

/**
 * Wrap text with link markdown tokens
 *
 * @param state - editor state
 */
export const wrapLink = state => {
  const { startOffset, endOffset } = state;
  const change = state.change();
  const url = 'http://example.com';
  if (startOffset === endOffset) {
    const text = `[link text](${url})`;
    change.insertText(text).move((text.length - 1) * -1).extend(text.length - 2);
  } else {
    change.wrapText('[', `](${(url)})`).moveOffsetsTo(endOffset + 3, endOffset + 3 + url.length)
  }
  change.focus();
  return change.state;
};

const activities = {
  has: {
    bold: hasEmphasis.bind(null, 'bold'),
    italic: hasEmphasis.bind(null, 'italic'),
    strikethrough: hasEmphasis.bind(null, 'strikethrough'),
    ul: hasList.bind(null, 'ul'),
    ol: hasList.bind(null, 'ol'),
    header: [
      null,
      hasBlock.bind(null, h1RegExp),
      hasBlock.bind(null, h2RegExp),
      hasBlock.bind(null, h3RegExp),
      hasBlock.bind(null, h4RegExp),
      hasBlock.bind(null, h5RegExp),
      hasBlock.bind(null, h6RegExp)
    ]
  },
  unwrap: {
    bold: unwrapEmphasis.bind(null, 'bold'),
    italic: unwrapEmphasis.bind(null, 'italic'),
    strikethrough: unwrapEmphasis.bind(null, 'strikethrough'),
    ul: unwrapList.bind(null, 'ul'),
    ol: unwrapList.bind(null, 'ol'),
    header: [
      null,
      unwrapBlock.bind(null, '# '.length),
      unwrapBlock.bind(null, '## '.length),
      unwrapBlock.bind(null, '### '.length),
      unwrapBlock.bind(null, '#### '.length),
      unwrapBlock.bind(null, '##### '.length),
      unwrapBlock.bind(null, '###### '.length)
    ]
  },
  wrap: {
    bold: wrapEmphasis.bind(null, 'bold'),
    italic: wrapEmphasis.bind(null, 'italic'),
    strikethrough: wrapEmphasis.bind(null, 'strikethrough'),
    ul: wrapList.bind(null, 'ul'),
    ol: wrapList.bind(null, 'ol'),
    header: [
      null,
      wrapBlock.bind(null, MATCH_RULES.header[1], '# '),
      wrapBlock.bind(null, MATCH_RULES.header[2], '## '),
      wrapBlock.bind(null, MATCH_RULES.header[3], '### '),
      wrapBlock.bind(null, MATCH_RULES.header[4], '#### '),
      wrapBlock.bind(null, MATCH_RULES.header[5], '##### '),
      wrapBlock.bind(null, MATCH_RULES.header[6], '###### ')
    ]
  }
};

export const hasAccent = (state, accent) => {
  if (activities.has[accent]) {
    return activities.has[accent](state);
  }

  return false;
};

export const getAccents = state => {
  const accents = [];
  for (let i = 0; i < EMPHASIS_NAMES.length; i++) {
    let accent = EMPHASIS_NAMES[i];
    if (hasAccent(state, accent)) {
      accents.push(accent);
    }
  }

  return accents;
};

export const wrapAccent = (state, accent) => {
  if (activities.wrap[accent]) {
    return activities.wrap[accent](state);
  }

  return state;
};

export const unwrapAccent = (state, accent) => {
  if (activities.unwrap[accent]) {
    return activities.unwrap[accent](state);
  }

  return state;
};

export const hasHeader = (state, level) => {
  if (activities.has.header[level]) {
    return activities.has.header[level](state);
  }

  return false;
};

export const wrapHeader = (state, level) => {
  if (activities.wrap.header[level]) {
    return activities.wrap.header[level](state);
  }

  return state;
};

export const unwrapHeader = (state, level) => {
  if (activities.unwrap.header[level]) {
    return activities.unwrap.header[level](state);
  }

  return state;
};

/**
 * getBracketsPos - function returns positions of brackets of the next to the cursor
 *    brackets can be () or []
 *
 * @param {string} text
 * @param {number} pos
 * @returns {{leftPos: number, rightPos: number}}
 */
export const getBracketsPos = (text, pos) => {
  let leftPart = text.substr(0, pos);
  let rightPart = text.substr(pos);

  // find brackets of the next to the cursor
  let leftBracketPos = leftPart.lastIndexOf('(');
  let rightBracketPos = rightPart.indexOf(')');
  let leftSquareBracketPos = leftPart.lastIndexOf('[');
  let rightSquareBracketPos = rightPart.indexOf(']');

  // checks which brackets closer to the cursor: round or square
  let isBrackets = leftBracketPos >= leftSquareBracketPos &&
    (leftBracketPos !== -1 && rightBracketPos !== -1 ||
      leftSquareBracketPos === -1 || rightSquareBracketPos === -1) ||
    leftBracketPos < leftSquareBracketPos &&
    (leftBracketPos !== -1 && rightBracketPos !== -1 &&
      (leftSquareBracketPos === -1 || rightSquareBracketPos === -1));

  // calculate the positions of brackets of the next to the cursor
  let leftPos = isBrackets ? leftBracketPos : leftSquareBracketPos;
  let rightPos = isBrackets ? rightBracketPos : rightSquareBracketPos;
  leftPos = leftPos === -1 ? false : leftPos + 1;
  rightPos = rightPos === -1 ? false : rightPos;

  return { leftPos, rightPos }
};

const insertText = ({ state, insertedText, insertedPos, endOffset }) => {
  const change = state.change();
  change.moveOffsetsTo(insertedPos).insertText(insertedText).
  moveOffsetsTo(endOffset + insertedText.length).focus();
  return change.state;
};

export const getPosAfterEmphasis = (state, accents) => {
  let maxPos = -1;
  const { texts, startOffset } = state;
  const accentsCount = accents.length;
  let characters = texts.get(0).charsData.characters;
  for (let i = 0; i < accentsCount; i++) {
    let accent = accents[i];
    let currLeftPos = getLeftEmphEdge(accent, characters, startOffset) + EMPHASIS[accent].length;
    if (maxPos < currLeftPos) {
      maxPos = currLeftPos;
    }
  }
  return maxPos;
};

export const addSpecialCharacter = (specialCharacter, state) => {
  const { startBlock, startOffset, endOffset } = state;
  let text = startBlock.text;
  let insertedPos = -1;
  let insertedText = specialCharacter;

  // get right position of the left accent closer to the cursor
  const accents = getAccents(state);
  if (accents.length > 0) { // this position has some accent
    let currLeftPos = getPosAfterEmphasis(state, accents);
    if (insertedPos < currLeftPos) {
      insertedPos = currLeftPos;
    }
  }

  // get the position of the left open bracket closer to the cursor
  let { leftPos, rightPos } = getBracketsPos(text, startOffset);
  // this position is between brackets
  if (leftPos && rightPos && leftPos > insertedPos) {
    insertedPos = leftPos;
  }

  // found left emphasis or left bracket
  if (insertedPos > -1) {
    // get the position of the left space closer to the cursor
    let spacePos = text.substring(insertedPos, startOffset).lastIndexOf(' ');
    if (spacePos === -1) { // space not found
      return insertText({ state, insertedText, insertedPos, endOffset });
    }
  }

  if (text.length === endOffset && text[text.length - 1] !== ' ' && (startOffset !== 0 || endOffset !== 0)) {
    insertedText = ` ${insertedText}`;
    insertedPos = text.length;
  } else {
    insertedPos = text.substring(0, startOffset).lastIndexOf(' ') + 1;
  }
  return insertText({ state, insertedText, insertedPos, endOffset });
};

export const copySelection = state => {
  const {
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset,
    isBackward
  } = state.selection;

  return {
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset,
    isBackward
  };
};

export const setSelectionToState = (state, selectBackup, isFocused = true) => {
  let change = state.change();
  change.select({
    ...selectBackup,
    isFocused
  });
  return change.state;
};
