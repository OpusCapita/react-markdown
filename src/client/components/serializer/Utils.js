function parseAttrs(attrs) {
  let objAttrs = {};

  for (let attr of attrs) {
    objAttrs[attr[0]] = attr[1];
  }

  return objAttrs;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;

const assign = Object.assign || function (obj) {
  for (let i = 1; i < arguments.length; i++) {
    let target = arguments[i];
    for (let key in target) {
      if (hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
};

function getLastElemTokenType(token) {
  const tokenData = token.type.split('_');
  return tokenData[tokenData.length - 1];
}

export default { parseAttrs, assign, getLastElemTokenType, };
