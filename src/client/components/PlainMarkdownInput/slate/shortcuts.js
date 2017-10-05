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
import { getSlateEditor } from '../../SlateEditor/Utils';

// this code will use in tomorrow
// import hasUnorderedListMarkdown from './transforms';
// import hasOrderedListMarkdown from './transforms';

// const emptyListItem = /^[0-9]+\.\s$/;
// const numbersFromListItem = /^[0-9]+/;

const scrollAmount = 40;

/**
 * Create new list item block, when the cursor move to a next line
 */
// const enterKeyDownHandler = (event, data, state, editor) => {
const enterKeyDownHandler = (event) => {
  if (event.keyCode === 13) {
    let selection = window.getSelection();
    let offsetTop = selection.anchorNode.parentNode.offsetTop;

    let editor = getSlateEditor(selection);

    if (editor.scrollTop + editor.offsetHeight < offsetTop + scrollAmount) {
      editor.scrollTop = offsetTop - editor.offsetHeight + scrollAmount;
    }

    // this code will use in tomorrow
    // if (hasUnorderedListMarkdown(state)) {
    //   event.preventDefault();
    //
    //   const t = state.transform();
    //   const { focusText } = state;
    //   const focusedText = focusText.text;
    //   if (focusedText === '* ') {
    //     t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
    //   } else {
    //     t.splitBlock().insertText('* ');
    //   }
    //   return t.focus().apply();
    // } else if (hasOrderedListMarkdown(state)) {
    //   event.preventDefault();
    //
    //   const t = state.transform();
    //   const { focusText } = state;
    //   const focusedText = focusText.text;
    //
    //   if (emptyListItem.test(focusedText)) {
    //     t.removeTextByKey(focusText.key, 0, focusedText.length).splitBlock();
    //   } else {
    //     const number = parseInt(numbersFromListItem.exec(focusedText)[0], 0);
    //     t.splitBlock().insertText(`${number + 1}. `);
    //   }
    //   return t.focus().apply();
    // }
  }

  return undefined;
};

// export default (event, data, state, editor) => { // eslint-disable-line
export default (event, data, state) => { // eslint-disable-line
  // const result = enterKeyDownHandler(event, data, state, editor);
  const result = enterKeyDownHandler(event);

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
