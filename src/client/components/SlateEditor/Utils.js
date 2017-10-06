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


export default {
  cloneElement,
}
