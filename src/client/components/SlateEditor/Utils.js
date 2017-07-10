import React from 'react';

const cloneElement = (children, props) => {
  if (children && !children.length) {
    children = [children, ]
  }

  return children && children
      .filter((it) => it !== null && it !== undefined)
      .map((child, index) => React.cloneElement(child, {
    ...props,
    key: index
  }))
};

export default {
  cloneElement,
}
