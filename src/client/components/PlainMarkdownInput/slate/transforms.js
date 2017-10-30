// common reg expressions
const olRegExp = /^\s*[0-9]+(\.|\))\s/;
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
  ul: [olRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
  ol: [ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp],
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

const EMPHASIS = {
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
  let arrChars = Array.from(character.marks);
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

function getLeftEmphEdge(accent, characters, startPos) {
  let leftEdge = -1;
  for (let i = startPos - 1; i >= 0; i--) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      leftEdge = i + 1;
      break
    }
  }
  return leftEdge < 0 ? 0 : leftEdge;
}

function getRightEmphEdge(accent, characters, startPos, maxPos) {
  let rightEdge = -1;
  for (let i = startPos + 1; i < maxPos; i++) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      rightEdge = i - 1;
      break
    }
  }
  return rightEdge < 0 ? maxPos - 1 : rightEdge;
}

function getLeftSelectionEdgeData({ accent, characters, startOffset }) {
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
}

function getRightSelectionEdgeData({ accent, characters, endOffset, text }) {
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
}

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
  let rightEmphEdge = getRightEmphEdge(accent, characters, endOffset, text.length);
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
        // #4 right edge on emphasis, left edge beyond markers
        let rightEmphEdge = getRightEmphEdge(accent, characters, endOffset, text.length - markerLength + 1);
        let rightMarker = text.substr(rightEmphEdge, markerLength);
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
  // const change = state.change();
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
 * @param state - editor state
 */
function unwrapBlock(removedLength, state) {
  const { startOffset, endOffset } = state;
  const change = state.change();
  const startPos = Math.max(startOffset - removedLength, 0);
  const endPos = Math.max(endOffset - removedLength, 0);
  change.moveOffsetsTo(0).deleteForward(removedLength).moveOffsetsTo(startPos, endPos).focus();
  return change.state;
}

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
  change.moveOffsetsTo(0).deleteForward(removedLength).moveOffsetsTo(startPos, endPos).focus();
  return change;
};

/**
 * Has list selected
 *
 * @param {string} type - list type
 * @param {Object} state - editor state
 * @param {number} numLine
 */
function hasListLine(type, state, numLine = 0) {
  let { texts } = state;
  if (texts.get(numLine).charsData) {
    let characters = texts.get(numLine).charsData.characters;
    if (characters.size > 0) {
      let character = characters.get(0);
      return hasMarkOnChar(character, type);
    }
  }
  return false;
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

const getUlMarker = function(text) {
  let res = ulRegExp.exec(text);
  if (res) {
    return res[0];
  }

  return false;
};

const getOlNum = function(text) {
  let res = olRegExp.exec(text);
  if (res) {
    return res[0].substr(0, res[0].length - 2);
  }

  return false;
};

/**
 * Wrap text with list token
 *
 * @param {string} accent
 * @param state - editor state
 * @returns {Object} - state
 */
const wrapList = function(accent, state) {
  let text = accent === 'ul' ? '* ' : '1. ';
  let itemNum;
  // let text, itemNum;
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
    if (accent === 'ul') {
      let ulMarker = getUlMarker(lineText);
      if (ulMarker) {
        text = ulMarker;
      } else {
        text = '* ';
      }
    } else {
      let olNum = getOlNum(lineText);

      if (olNum) {
        itemNum = +olNum;
      } else {
        itemNum = 0;
      }
    }

    let change = state.change();
    let keysLength = keys.length;
    let lastNum = keysLength - 1;
    for (let i = 0; i < keysLength; i++) {
      moveSelectionToLine(change, keys[i]);
      // change.select({
      //   anchorKey: keys[i],
      //   anchorOffset: 0,
      //   focusKey: keys[i],
      //   focusOffset: 0,
      //   isFocused: true,
      //   isBackward: false,
      // });
      if (i === 0) {
        firstBefore = change.state.texts.get(0).text.length;
      } else if (i === lastNum) {
        lastBefore = change.state.texts.get(0).text.length;
      }
      itemNum++;
      if (!hasBlock(MATCH_SINGLE_RULE[accent], change.state)) {
        text = accent === 'ul' ? text : `${itemNum}. `;
        change = wrapBlockForChange(MATCH_RULES[accent], text, change);// eslint-disable-line
        if (i === 0) {
          firstAfter = change.state.texts.get(0).text.length;
        } else if (i === lastNum) {
          lastAfter = change.state.texts.get(0).text.length;
        }
      } else {
        if (i === 0) {
          firstAfter = firstBefore;
        } else if (i === lastNum) {
          lastAfter = lastBefore;
        }
      }
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
 * @param state - editor state
 * @returns {Object} - state
 */
export const unwrapListLine = (accent, state) => {
  const { focusText } = state;
  const focusedText = focusText.text;
  const result = MATCH_SINGLE_RULE[accent].exec(focusedText);
  if (result) {
    const length = result[0].length;
    return unwrapBlock(length, state);
  }
  return state;
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
      // change.select({
      //   anchorKey: keys[i],
      //   anchorOffset: 0,
      //   focusKey: keys[i],
      //   focusOffset: 0,
      //   isFocused: true,
      //   isBackward: false,
      // });
      if (i === 0) {
        firstBefore = change.state.texts.get(0).text.length;
      } else if (i === lastNum) {
        lastBefore = change.state.texts.get(0).text.length;
      }
      change = unwrapListCallbacksForChange[accent](change);
      if (i === 0) {
        firstAfter = change.state.texts.get(0).text.length;
      } else if (i === lastNum) {
        lastAfter = change.state.texts.get(0).text.length;
      }
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
    ul: hasList.bind(null, 'list'),
    ol: hasList.bind(null, 'ordered-list'),
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
    // ul: unwrapList.bind(null, ulRegExp),
    // ol: unwrapList.bind(null, olRegExp),
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
    // ul: wrapBlock.bind(null, MATCH_RULES.ul, '* '),
    // ol: wrapBlock.bind(null, MATCH_RULES.ol, '1. '),
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
