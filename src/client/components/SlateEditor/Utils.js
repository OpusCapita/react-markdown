import React from 'react';

const cloneElement = (children, props) => {
  let result = [];
  if (children && !children.length) {
    result = [children];
  }

  return result.
      filter((it) => it !== null && it !== undefined).
      map((child, index) => React.cloneElement(child, {
        ...props,
        key: index
      }));
};

export default {
  cloneElement,
}
