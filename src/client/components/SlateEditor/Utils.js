import React from 'react';

const cloneElement = (children, props) => {
  let result = children;
  if (result && !result.length) {
    result = [result];
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
