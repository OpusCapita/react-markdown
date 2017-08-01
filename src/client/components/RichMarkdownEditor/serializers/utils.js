function parseAttrs(attrs) {
  let objAttrs = {};

  for (let attr of attrs) {
    objAttrs[attr[0]] = attr[1];
  }

  return objAttrs;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

const assign = Object.assign || function(obj) {
  for (let i = 1; i < arguments.length; i++) {
    let target = arguments[i];
    for (let key in target) {
      if (hasOwnProperty.call(target, key)) {
        obj[key] = target[key]; // eslint-disable-line
      }
    }
  }
  return obj;
};

function getLastElemTokenType(token) {
  const tokenData = token.type.split('_');
  return tokenData[tokenData.length - 1];
}

/**
 * Flattens nested Collections from arrays or list
 * @param {List|Array} arr
 * @returns {Array}
 */

function flatten(arr) {
  let newArr = [];

  for (let el of arr) {
    if (typeof el === 'string') {
      newArr.push(el);
    } else if (el && (el.size || el.length)) {
      newArr = newArr.concat(flatten(el));
    } else {
      newArr.push('');
    }
  }

  return newArr;
}

export default { parseAttrs, assign, getLastElemTokenType, flatten, };
