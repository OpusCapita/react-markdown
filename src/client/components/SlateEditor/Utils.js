import React from 'react';
import filter from 'lodash/filter';

const cloneElement = (children, props) => {
  let result = children;
  if (result && !result.length) {
    result = [result];
  }

  return filter(result, (it) => it !== null && it !== undefined).
      map((child, index) => React.cloneElement(child, {
        ...props,
        key: index
      }));
};

export default {
  cloneElement,
}
