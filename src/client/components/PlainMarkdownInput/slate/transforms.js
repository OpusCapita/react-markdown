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
};

/**
 * Has text wrapped of accent at characters
 *
 * @param mark
 * @param state - editor state
 */
function hasAccentAtLetters(mark, state) {
  const { startOffset, endOffset, focusText } = state;
  const focusedText = focusText.text;
  const markLength = mark.length;
  if ((startOffset - markLength) >= 0 && endOffset + markLength <= focusedText.length) {
    const text = focusedText.slice(startOffset - markLength, endOffset + markLength);
    return text && text.startsWith(mark) && text.endsWith(mark);
  } else {
    return false;
  }
}

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
 * XXX for shortcuts
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
 * XXX for shortcuts
 * Unwrap text with italic markdown token
 *
 * @param state - editor state
 */
export const unwrapItalicMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  return state.transform().
    removeTextByKey(focusText.key, endOffset, 1).
    removeTextByKey(focusText.key, startOffset - 1, 1).
    focus().apply();
};

/**
 * XXX for shortcuts
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
 * XXX for shortcuts
 * Unwrap text with bold markdown tokens
 *
 * @param state - editor state
 */
export const unwrapBoldMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  return state.transform().
  removeTextByKey(focusText.key, endOffset, 2).
  removeTextByKey(focusText.key, startOffset - 2, 2).
  focus().apply();
};

/**
 * XXX for shortcuts
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
 * XXX for shortcuts
 * Unwrap text with strikethrought markdown tokens
 *
 * @param state - editor state
 */
export const unwrapStrikethroughMarkdown = state => {
  const { startOffset, endOffset, focusText } = state;
  return state.transform().
  removeTextByKey(focusText.key, endOffset, 2).
  removeTextByKey(focusText.key, startOffset - 2, 2).
  focus().apply()
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

const activities = {
  has: {
    bold: hasAccentAtLetters.bind(null, '**'),
    italic: hasAccentAtLetters.bind(null, '_'),
    strikethrough: hasAccentAtLetters.bind(null, '~~'),
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
