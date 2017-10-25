// common reg expressions
const olRegExp = /^\s*[0-9]+(\.|\))\s/;
const ulRegExp = /^\s*(\*|\+|-)\s/;
const h1RegExp = /^#\s/;
const h2RegExp = /^##\s/;
const h3RegExp = /^###\s/;
const h4RegExp = /^####\s/;
const h5RegExp = /^#####\s/;
const h6RegExp = /^######\s/;

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
    [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp]
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
 * Has block selected
 *
 * @param {string} type - list type
 * @param {Object} state - editor state
 */
function hasList(type, state) {
  let { texts } = state;
  if (texts.get(0).charsData) {
    let characters = texts.get(0).charsData.characters;
    if (characters.size > 0) {
      let character = characters.get(0);
      return hasMarkOnChar(character, type);
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
                  (startOffset > 1 && !hasMarkOnChar(characters.get(startOffset - 2), 'bold'))) ||
                  (startOffset < focusText.length - 1 &&
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

/**
 * Wrap text with mark
 *
 * @param mark
 * @param state
 */
function wrapEmphasis(mark, state) {
  // 1) вне маркеров - оборачиваем курсор или выделение в маркеры
  // 2) пересекается с оберткой
  //    - расширяем обертку до границы выделения с одной стороны (переносим маркер)
  // 3) полностью перекрывает оберкту
  //    - расширяем обертку до границы выделения с двух сторон (переносим маркеры)
  // 4) на внешней границе обертки
  //    - оборачиваем курсор или выделение в маркеры
  //    - внутренние маркеры такого же типа удаляем

  // 1) найти границы обертки с текущим маркером
  const { startOffset, endOffset } = state;
  const lettersCount = mark.length;
  const change = state.change();
  if (startOffset === endOffset) {
    const text = '';
    change.insertText(`${mark}${mark}`).
    move(-lettersCount).
    extend(text.length * -1);
  } else {
    change.wrapText(mark, mark);
  }
  change.focus();
  return change.state;
}

function getLeftEdge(accent, characters, startPos) {
  let leftEdge = -1;
  for (let i = startPos - 1; i >= 0; i--) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      leftEdge = i + 1;
      break
    }
  }
  return leftEdge < 0 ? 0 : leftEdge;
}

function getRightEdge(accent, characters, startPos, maxPos) {
  let rightEdge = -1;
  for (let i = startPos + 1; i < maxPos; i++) {
    if (!hasMarkOnChar(characters.get(i), accent)) {
      rightEdge = i - 1;
      break
    }
  }
  return rightEdge < 0 ? maxPos : rightEdge;
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
  const leftEdge = getLeftEdge(accent, characters, startOffset);
  const rightEdge = getRightEdge(accent, characters, startOffset, text.length);
  const marker = text.substr(leftEdge, markerLength);

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
    if (leftEdge + 1 === startOffset || leftEdge + markerLength === startOffset ||
      rightEdge === startOffset || rightEdge - markerLength + 1 === startOffset) {
      return state

    // #3 the between markers, add markers to the place of the cursor
    } else {
      change.insertText(`${marker}${marker}`).
      move(-markerLength).focus();
      return change.state;
    }

  // selection
  } else {
    // #4 the selection on the left edge, do nothing
    if ((leftEdge === startOffset || leftEdge + 1 === startOffset) &&
      leftEdge + 1 === endOffset || leftEdge + markerLength === endOffset) {
      return state
    }

    // #5 the selection on the right edge, do nothing
    if ((rightEdge - markerLength === startOffset || rightEdge - markerLength + 1 === startOffset) &&
      (rightEdge - 1 === endOffset || rightEdge === endOffset)) {
      return state
    }

    // #6 the selection between markers, wrap selection in additional markers
    // (between additional markers there is no current emphasis)
    if (leftEdge + markerLength < startOffset && endOffset < rightEdge - markerLength - 1) {
      change.wrapText(marker, marker).focus();
      return change.state;
    }

    // #7 the selection on markers, delete markers
    if (leftEdge <= startOffset && startOffset <= leftEdge + markerLength &&
      rightEdge - markerLength + 1 <= endOffset && endOffset <= rightEdge) {
      change.removeTextByKey(focusKey, rightEdge - markerLength + 1, markerLength).
      removeTextByKey(focusKey, leftEdge, markerLength).focus();
      return change.state;
    }

    // #8 startOffset on left marker, endOffset between markers,
    // remove accent from the left part of a wrapper
    if (leftEdge <= startOffset && startOffset <= leftEdge + markerLength) {
      change.insertTextByKey(focusKey, endOffset, marker).
      removeTextByKey(focusKey, leftEdge, markerLength).
      moveOffsetsTo(leftEdge, endOffset - markerLength).focus();
      return change.state;
    }

    // #9 startOffset between markers, endOffset on right marker,
    // remove accent from the right part of a wrapper
    change.removeTextByKey(focusKey, rightEdge - markerLength + 1, markerLength).
    insertTextByKey(focusKey, startOffset, marker).
    moveOffsetsTo(startOffset + markerLength, rightEdge + 1).focus();
    return change.state;
  }
}

/**
 * Unwrap text with OL markdown token
 *
 * @param {RegExp} regExp
 * @param state - editor state
 * @returns {Object} - editor state
 */
function unwrapList(regExp, state) {
  const { focusText } = state;
  const focusedText = focusText.text;
  const result = regExp.exec(focusedText);
  const length = result[0].length;
  return unwrapBlock(length, state);
}

/**
 * Wrap text with link markdown tokens
 *
 * @param state - editor state
 */
export const wrapLinkMarkdown = state => {
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

/**
 * Check is the current state selected as multi line
 *
 * @param startKey - start selection key in current editor state
 * @param endKey - end selection key in current editor state
 */
export const hasMultiLineSelection = ({ selection: { startKey, endKey } }) => startKey !== endKey;

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
    ul: unwrapList.bind(null, ulRegExp),
    ol: unwrapList.bind(null, olRegExp),
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
    bold: wrapEmphasis.bind(null, '**'),
    italic: wrapEmphasis.bind(null, '_'),
    strikethrough: wrapEmphasis.bind(null, '~~'),
    ul: wrapBlock.bind(null, MATCH_RULES.ul, '* '),
    ol: wrapBlock.bind(null, MATCH_RULES.ol, '1. '),
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
