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
  return state.transform().
    moveOffsetsTo(0).
    deleteForward(removedLength).
    moveOffsetsTo(startOffset - removedLength, endOffset - removedLength).
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
    moveOffsetsTo(startOffset + text.length - length, endOffset + text.length - length).
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
export const wrapItalicMarkdown = state => {
  const { startOffset, endOffset } = state;
  let t = state.transform();
  if (startOffset === endOffset) {
    const text = '';
    t.insertText('_' + text + '_').
      move(-1).
      extend(text.length * -1)
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
  const { startOffset, endOffset, focusText } = state;
  return state.transform().
    removeTextByKey(focusText.key, endOffset, 1).
    removeTextByKey(focusText.key, startOffset - 1, 1).
    focus().apply();
};

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
export const wrapBoldMarkdown = state => {
  const { startOffset, endOffset } = state;
  let t = state.transform();
  if (startOffset === endOffset) {
    const text = '';
    t.insertText('**' + text + '**').
      move(-2).
      extend(text.length * -1)
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
  const { startOffset, endOffset, focusText } = state;
  return state.transform().
    removeTextByKey(focusText.key, endOffset, 2).
    removeTextByKey(focusText.key, startOffset - 2, 2).
    focus().apply()
};

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
