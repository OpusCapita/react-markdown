const scrollAmount = 20;

export const getClosestElemFromClass = (elem, className) => {
  if (!elem.parentElement) {
    return null;
  }
  if (elem.parentElement.classList.contains(className)) {
    return elem.parentElement;
  }
  return getClosestElemFromClass(elem.parentElement, className)
};

export const getSlateEditor = selection => {
  if (selection.anchorNode.parentNode && selection.anchorNode.parentNode.closest) {
    return selection.anchorNode.parentNode.closest('.react-markdown--slate-content');
  }
  return getClosestElemFromClass(selection.anchorNode.parentNode, 'react-markdown--slate-content');
};

export const autoScrollToTop = () => {
  let selection = window.getSelection();

  if (selection.anchorNode) {
    let offsetTop = selection.anchorNode.parentNode.offsetTop;
    let editor = getSlateEditor(selection);

    if (editor && editor.scrollTop + editor.offsetHeight < offsetTop + scrollAmount) {
      editor.scrollTop = offsetTop - editor.offsetHeight + scrollAmount;
    }
  }
};

export const addSpecialCharacter = (specialCharacter, state) => {
  let text = state.startBlock.text;
  let newOffset = 0;
  let insertedText = '';
  if ((text.length === state.endOffset) && (text[text.length - 1] !== ' ')) {
    insertedText = ` ${specialCharacter}`;
    newOffset = text.length;
  } else {
    insertedText = specialCharacter;
    newOffset = text.substring(0, state.startOffset).lastIndexOf(' ') + 1;
  }
  const change = state.change();
  change.moveOffsetsTo(newOffset).wrapText(insertedText, '').
  moveOffsetsTo(state.endOffset + insertedText.length).focus();
  return change.state;
};
