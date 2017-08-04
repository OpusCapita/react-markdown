function parseAttrs(attrs) {
  let objAttrs = {};

  attrs.forEach(attr => {
    objAttrs[attr[0]] = attr[1];
  });

  return objAttrs;
}

function getLastElemTokenType(token) {
  const tokenData = token.type.split('_');
  return tokenData[tokenData.length - 1];
}

function createArrayJoined(length, value, sep = '') {
  const arrFill = [];
  for (let i = 0; i < length; i++) {
    arrFill.push(value);
  }

  return arrFill.join(sep);
}


export default { parseAttrs, getLastElemTokenType, createArrayJoined, };
