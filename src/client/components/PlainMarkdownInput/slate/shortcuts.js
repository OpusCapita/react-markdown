import {
  hasBoldMarkdown,
  wrapBoldMarkdown,
  unwrapBoldMarkdown,
  hasItalicMarkdown,
  wrapItalicMarkdown,
  unwrapItalicMarkdown,
  hasStrikethroughMarkdown,
  wrapStrikethroughMarkdown,
  unwrapStrikethroughMarkdown,
} from './transforms';

import hasUnorderedListMarkdown from './transforms';
import hasOrderedListMarkdown from './transforms';

const emptyListItem = /^[0-9]+\.\s$/;
const numbersFromListItem = /^[0-9]+/;

/**
 * Create new list item block, when the cursor move to a next line
 */
const splitListBlocksAutoHandler = (event, data, state) => {
  // if (event.keyCode === 13) {
  //   if (hasUnorderedListMarkdown(state)) {
  //     event.preventDefault();
  //
  //     const t = state.transform();
  //     const { focusText } = state;
  //     const focusedText = focusText.text;
  //     if (focusedText === '* ') {
  //       t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
  //     } else {
  //       t.splitBlock().insertText('* ');
  //     }
  //     return t.focus().apply();
  //   } else if (hasOrderedListMarkdown(state)) {
  //     event.preventDefault();
  //
  //     const t = state.transform();
  //     const { focusText } = state;
  //     const focusedText = focusText.text;
  //
  //     if (emptyListItem.test(focusedText)) {
  //       t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
  //     } else {
  //       const number = parseInt(numbersFromListItem.exec(focusedText)[0], 0);
  //       t.splitBlock().insertText(`${number + 1}. `);
  //     }
  //     return t.focus().apply();
  //   }
  // }

  if (event.keyCode === 13) {
    event.preventDefault();
    event.stopPropagation();
    return state.transform().insertText(`\n`).focus().apply();
  }

  return undefined;
};

export default (event, data, state) => {
  const result = splitListBlocksAutoHandler(event, data, state);

  if (result) {
    return result;
  }
  // is ctrl
  if (data.isMod) {
    if (data.key === 'b') {
      if (hasBoldMarkdown(state)) {
        return unwrapBoldMarkdown(state);
      } else {
        return wrapBoldMarkdown(state);
      }
    } else if (data.key === 'i') {
      if (hasItalicMarkdown(state)) {
        return unwrapItalicMarkdown(state);
      } else {
        return wrapItalicMarkdown(state);
      }
    } else if (data.key === 's') {
      event.preventDefault();
      if (hasStrikethroughMarkdown(state)) {
        return unwrapStrikethroughMarkdown(state);
      } else {
        return wrapStrikethroughMarkdown(state);
      }
    }
  }

  return undefined;
};
