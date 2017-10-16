// common reg expressions
const olRegExp = /^[0-9]+\.\s/;
const ulRegExp = /^\*\s/;
const h1RegExp = /^#\s/;
const h2RegExp = /^##\s/;
const h3RegExp = /^###\s/;
const h4RegExp = /^####\s/;
const h5RegExp = /^#####\s/;
const h6RegExp = /^######\s/;

/**
 * Has block selected
 *
 * @param regExp - match regexp
 * @param state - editor state
 */
const hasBlock = function(regExp, state) {
  const { focusText } = state;
  const focusedText = focusText.text;
  return regExp.test(focusedText);
};

/**
 * Unwrap block
 *
 * @param removedLength - first length should be removed
 * @param state - editor state
 */
const unwrapBlock = function(removedLength, state) {
  const { startOffset, endOffset } = state;
  const change = state.change();
  const startPos = Math.max(startOffset - removedLength, 0);
  const endPos = Math.max(endOffset - removedLength, 0);
  change.moveOffsetsTo(0).deleteForward(removedLength).moveOffsetsTo(startPos, endPos).focus();
  return change.state;

  // return state.transform().
  //   moveOffsetsTo(0).
  //   deleteForward(removedLength).
  //   moveOffsetsTo(Math.max(startOffset - removedLength, 0), Math.max(endOffset - removedLength, 0)).
  //   focus().apply();
  // return state.transform().
  //   moveOffsetsTo(0).
  //   deleteForward(removedLength).
  //   moveOffsetsTo(Math.max(startOffset - removedLength, 0), Math.max(endOffset - removedLength, 0)).
  //   focus().apply();
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

  // const t = state.transform().moveOffsetsTo(0);
  // let length = 0;
  // for (let i = 0, k = matchRules.length; i < k; i++) {
  //   const result = matchRules[i].exec(focusedText);
  //   if (result) {
  //     length = result[0].length;
  //     t.deleteForward(length);
  //     break;
  //   }
  // }
  // return t.insertText(text).
  //   moveOffsetsTo(Math.max(startOffset + text.length - length, 0), Math.max(endOffset + text.length - length, 0)).
  //   focus().apply();
};

/**
 * Has text wrapped italic markdown tokens
 *
 * @param state - editor state
 */
export const hasItalicMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  if ((startOffset - 1) >= 0 && endOffset + 1 <= focusedText.length) {
    const text = focusedText.slice(startOffset - 1, endOffset + 1);
    return text && text.startsWith('_') && text.endsWith('_');
  } else {
    return false;
  }
};

/**
 * Wrap text italic with markdown token
 *
 * @param state - editor state
 */
// export const wrapItalicMarkdown = state => {
//   const { startOffset, endOffset } = state;
//   const change = state.change();
//   if (startOffset === endOffset) {
//     const text = '';
//     change.insertText('_' + text + '_').
//       move(-1).
//       extend(text.length * -1);
//   } else {
//     change.wrapText('_', '_');
//   }
//   change.focus();
//   return change.state;
//
//   // let t = state.transform();
//   // if (startOffset === endOffset) {
//   //   const text = '';
//   //   t.insertText('_' + text + '_').
//   //     move(-1).
//   //     extend(text.length * -1);
//   // } else {
//   //   t.wrapText('_', '_');
//   // }
//   // return t.focus().apply();
// };

/**
 * Unwrap text with italic markdown token
 *
 * @param state - editor state
 */
// export const unwrapItalicMarkdown = state => {
//   const { startOffset, endOffset, focusText } = state;
//   const change = state.change();
//   const focusKey = focusText.key;
//   change.removeTextByKey(focusKey, endOffset, 1).removeTextByKey(focusKey, startOffset - 1, 1).focus();
//   return change.state;
//   // return state.transform().
//   //   removeTextByKey(focusText.key, endOffset, 1).
//   //   removeTextByKey(focusText.key, startOffset - 1, 1).
//   //   focus().apply();
// };

/**
 * Has text wrapped with bold markdown tokens
 *
 * @param state - editor state
 */
export const hasBoldMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  if ((startOffset - 2) >= 0 && endOffset + 2 <= focusedText.length) {
    const text = focusedText.slice(startOffset - 2, endOffset + 2);
    return text && text.startsWith('**') && text.endsWith('**');
  } else {
    return false;
  }
};

/**
 * Wrap text with bold markdown tokens
 *
 * @param state - editor state
 */
// export const wrapBoldMarkdown = state => {
//   const { startOffset, endOffset } = state;
//   const change = state.change();
//   if (startOffset === endOffset) {
//     const text = '';
//     change.insertText('**' + text + '**').
//     move(-2).
//     extend(text.length * -1);
//   } else {
//     change.wrapText('**', '**');
//   }
//   change.focus();
//   return change.state;
//
//   // let t = state.transform();
//   // if (startOffset === endOffset) {
//   //   const text = '';
//   //   t.insertText('**' + text + '**').
//   //     move(-2).
//   //     extend(text.length * -1);
//   // } else {
//   //   t.wrapText('**', '**');
//   // }
//   // return t.focus().apply();
// };

/**
 * Unwrap text from accent
 *
 * @param state - editor state
 * @param count - count of the deleted characters
 */
function unwrapLetters(count, state) {
  const { startOffset, endOffset, focusText } = state;
  const change = state.change();
  const focusKey = focusText.key;
  change.removeTextByKey(focusKey, endOffset, count).
  removeTextByKey(focusKey, startOffset - count, count).focus();
  return change.state;
}

/**
 * Unwrap text with bold markdown tokens
 *
 * @param state - editor state
 */
// export const unwrapBoldMarkdown = state => {
//   return unwrapLetters(state, 2);
//   const { startOffset, endOffset, focusText } = state;
//   const change = state.change();
//   const focusKey = focusText.key;
//   change.removeTextByKey(focusKey, endOffset, 2).removeTextByKey(focusKey, startOffset - 2, 2).focus();
//   return change.state;
//
//   // return state.transform().
//   //   removeTextByKey(focusText.key, endOffset, 2).
//   //   removeTextByKey(focusText.key, startOffset - 2, 2).
//   //   focus().apply();
// };

/**
 * Has wrap text with strikethrough markdown tokens
 *
 * @param state - editor state
 */
export const hasStrikethroughMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  if ((startOffset - 2) >= 0 && endOffset + 2 <= focusedText.length) {
    const text = focusedText.slice(startOffset - 2, endOffset + 2);
    return text && text.startsWith('~~') && text.endsWith('~~');
  } else {
    return false;
  }
};

/**
 * Wrap text with mark
 *
 * @param mark
 * @param state
 */
function wrapLetters(mark, state) {
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

/**
 * Wrap text with strikethrough markdown tokens
 *
 * @param state
 */
// export const wrapStrikethroughMarkdown = state => {
//   const { startOffset, endOffset } = state;
//   let t = state.transform();
//   if (startOffset === endOffset) {
//     const text = '';
//     t.insertText('~~' + text + '~~').
//       move(-2).
//       extend(text.length * -1)
//   } else {
//     t.wrapText('~~', '~~');
//   }
//   return t.focus().apply();
// };

/**
 * Unwrap text with strikethrought markdown tokens
 *
 * @param state - editor state
 */
// export const unwrapStrikethroughMarkdown = state => {
//   const { startOffset, endOffset, focusText } = state;
//   return state.transform().
//     removeTextByKey(focusText.key, endOffset, 2).
//     removeTextByKey(focusText.key, startOffset - 2, 2).
//     focus().apply()
// };

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

const activities = {
  has: {
    bold: hasBoldMarkdown,
    italic: hasItalicMarkdown,
    strikethrough: hasStrikethroughMarkdown,
    ul: hasBlock.bind(null, ulRegExp),
    ol: hasBlock.bind(null, olRegExp),
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
    // bold: unwrapBoldMarkdown,
    // italic: unwrapItalicMarkdown,
    // strikethrough: unwrapStrikethroughMarkdown,
    bold: unwrapLetters.bind(null, 2),
    italic: unwrapLetters.bind(null, 1),
    strikethrough: unwrapLetters.bind(null, 2),
    ul: unwrapBlock.bind(null, '* '.length),
    ol: unwrapOrderedListMarkdown,
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
    // bold: wrapBoldMarkdown,
    // italic: wrapItalicMarkdown,
    // strikethrough: wrapStrikethroughMarkdown,
    bold: wrapLetters.bind(null, '**'),
    italic: wrapLetters.bind(null, '_'),
    strikethrough: wrapLetters.bind(null, '~~'),
    ul: wrapBlock.bind(null, [olRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '* '),
    ol: wrapBlock.bind(null, [ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '1. '),
    header: [
      null,
      wrapBlock.bind(null, [olRegExp, ulRegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '# '),
      wrapBlock.bind(null, [olRegExp, ulRegExp, h1RegExp, h3RegExp, h4RegExp, h5RegExp, h6RegExp], '## '),
      wrapBlock.bind(null, [olRegExp, ulRegExp, h1RegExp, h2RegExp, h4RegExp, h5RegExp, h6RegExp], '### '),
      wrapBlock.bind(null, [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h5RegExp, h6RegExp], '#### '),
      wrapBlock.bind(null, [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h6RegExp], '##### '),
      wrapBlock.bind(null, [olRegExp, ulRegExp, h1RegExp, h2RegExp, h3RegExp, h4RegExp, h5RegExp], '###### ')
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
