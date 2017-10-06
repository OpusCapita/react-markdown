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
  let offsetTop = selection.anchorNode.parentNode.offsetTop;

  let editor = getSlateEditor(selection);

  if (editor.scrollTop + editor.offsetHeight < offsetTop + scrollAmount) {
    editor.scrollTop = offsetTop - editor.offsetHeight + scrollAmount;
  }
};
