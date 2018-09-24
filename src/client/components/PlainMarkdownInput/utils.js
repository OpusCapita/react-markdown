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
  const selection = window.getSelection();

  if (selection.anchorNode) {
    const offsetTop = selection.anchorNode.parentNode.offsetTop;
    const editor = getSlateEditor(selection);

    if (editor && editor.scrollTop + editor.offsetHeight < offsetTop + scrollAmount) {
      editor.scrollTop = offsetTop - editor.offsetHeight + scrollAmount;
    }
  }
};
