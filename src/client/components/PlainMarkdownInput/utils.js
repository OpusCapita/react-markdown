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

export const getEditorScrollTop = () => {
  let selection = window.getSelection();

  if (selection.anchorNode) {
    let editor = getSlateEditor(selection);
    return editor.scrollTop;
  }

  return -1;
};

export const setEditorScrollTop = scrollTop => {
  let selection = window.getSelection();

  if (selection.anchorNode) {
    let editor = getSlateEditor(selection);
    editor.scrollTop = scrollTop;
  }
};
