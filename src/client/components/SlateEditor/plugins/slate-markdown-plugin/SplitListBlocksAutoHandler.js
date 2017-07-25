import {
  hasUnorderedListMarkdown,
  hasOrderedListMarkdown,
} from './MarkdownUtils';

const emptyListItem = /^[0-9]+\.\s$/;
const numbersFromListItem = /^[0-9]+/;

/**
 * Create new list item block, when the cursor move to a next line
 */
const SplitListBlocksAutoHandler = (event, data, state) => {
  if (event.keyCode === 13) {
    if (hasUnorderedListMarkdown(state)) {
      event.preventDefault();

      const t = state.transform();
      const { focusText } = state;
      const focusedText = focusText.text;
      if (focusedText === '* ') {
        t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
      } else {
        t.splitBlock().insertText('* ');
      }
      return t.focus().apply();
    } else if (hasOrderedListMarkdown(state)) {
      event.preventDefault();

      const t = state.transform();
      const { focusText } = state;
      const focusedText = focusText.text;

      if (emptyListItem.test(focusedText)) {
        t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
      } else {
        const number = parseInt(numbersFromListItem.exec(focusedText)[0], 0);
        t.splitBlock().insertText(`${number + 1}. `);
      }
      return t.focus().apply();
    }
  }

  return undefined;
};

export default SplitListBlocksAutoHandler;
