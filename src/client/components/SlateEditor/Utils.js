import React from 'react';
import filter from 'lodash/filter';

const cloneElement = (children, props) => {
  let result = children;
  if (result && !result.length) {
    result = [result];
  }
  result = filter(result, (it) => it);
  return React.Children.map(result, (child) => React.cloneElement(child, {
    ...props
  }));
};

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
    // return selection.anchorNode.parentNode.closest('.react-markdown--slate-content__editor');
    return selection.anchorNode.parentNode.closest('.react-markdown--slate-content');
  }
  return getClosestElemFromClass(selection.anchorNode.parentNode, 'react-markdown--slate-content');
};


export default {
  cloneElement,
}
