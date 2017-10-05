import MarkdownIt from 'markdown-it';
import _ from 'lodash';

const markdown = new MarkdownIt({
  html: false,              // Enable HTML tags in source
  xhtmlOut: false,          // Use '/' to close single tags (<br />).
                            // This is only for full CommonMark compatibility.
  breaks: false,            // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                            // useful for external highlighters.
  // Enable some language-neutral replacement + quotes beautification
  typographer: false
});

const EMPHASISES = {
  strong: 'bold',
  em: 'italic',
  s: 'strikethrough',
  link: 'url'
};
const INLINE_OPEN = [
  'strong_open', 's_open', 'em_open', 'link_open'
];
const TOKENS_DATA = [
  {
    open: 'blockquote_open',
    close: 'blockquote_close',
    tokenName: 'blockquote'
  },
  {
    open: 'bullet_list_open',
    close: 'bullet_list_close',
    tokenName: 'bullet_list'
  },
  {
    open: 'list_item_open',
    close: 'list_item_close',
    tokenName: 'list_item'
  },
];

function changeText(tokens, markup = '') {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'text') {
      tokens[i] = (i === 0 && markup !== '' ? `${markup} ` : '') + tokens[i].content; // eslint-disable-line
    } else if (tokens[i].type === 'code_inline') {
      let content = `${tokens[i].markup}${tokens[i].content}${tokens[i].markup}`;
      let length = content.length;
      if (tokens[i].markup === '```') {
        content = [content];
      }
      tokens[i] = { // eslint-disable-line
        type: "code",
        content,
        length
      };
    }
  }
  return tokens;
}

/**
 * getTokensLength - Function calculate tokens' length
 *
 * @param tokens
 * @returns {Number}
 */

function getTokensLength(tokens) {
  if (typeof tokens === 'string') {
    return tokens.length;
  }
  return tokens.reduce((acc, token) => {
    return acc + (token.length ? token.length : 0);
  }, 0);
}

function getEmptyText() {
  return {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  };
}

/**
 * getHeaderContent - Function create content for header-token
 *
 * @param tokens
 * @param type
 * @param markup
 * @returns {{type: *, content}}
 */

function getHeaderContent(tokens, type, markup) {
  if (tokens[1].children.length === 0) {
    tokens[1].children.push(getEmptyText());
  } else if (tokens[1].children[0].type !== 'text') {
    tokens[1].children.unshift(getEmptyText());
  }
  let content = changeText(tokens[1].children, markup);
  return {
    type,
    content,
    length: getTokensLength(content)
  };
}

/**
 * getBlockContent - Function returns block content
 *
 * @param tokens
 * @param type
 * @param markup
 * @param start
 * @returns {{type: *, content, markup: *}}
 */

function getBlockContent(tokens, type, markup, start = false) {
  const content = {
    type,
    content: processBlockTokens(tokens.slice(1, -1)), // eslint-disable-line
    markup
  };
  if (start) {
    content.start = start;
  }
  return content;
}

function joinArrString(arr) {
  let resultArr = [];
  let stringArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'string') {
      stringArr.push(arr[i]);
    } else {
      if (stringArr.length > 0) {
        resultArr.push(stringArr.join(''));
        stringArr = [];
      }
      resultArr.push(arr[i]);
    }
  }
  if (stringArr.length > 0) {
    resultArr.push(stringArr.join(''));
  }
  return resultArr;
}

function parseBlockquote(token) {
  if (token.type === 'blockquote') {
    token = parseBlockquote(token.content); // eslint-disable-line
    token.unshift('>');
  } else {
    token.unshift(' ');
  }
  return token;
}

function getHRToken(tokens) {
  return [{
    type: "hr",
    content: tokens[0].markup,
    length: tokens[0].markup.length,
  }]
}

function getList(tokens, type, markup) {
  return [{
    type,
    content: [tokens[0].content],
    markup
  }];
}

function parseCodeBlock(tokens) {
  let res = /^[\+\-\*](?= )/.test(tokens[0].content);
  if (res) {
    return getList(tokens, 'list', res[0]);
  }
  res = /^[\d]+(\.|\))(?= )/.test(tokens[0].content);
  if (res) {
    return getList(tokens, 'ordered-list', res[0]);
  }
  return [tokens[0].content];
}

function getEmphasisType(openTag) {
  return EMPHASISES[openTag.split('_')[0]];
}

function getCloseTag(openTag) {
  return `${openTag.split('_')[0]}_close`;
}

function getClosePos(tokens, startPos, closeTag, markup) {
  for (let i = startPos + 1; i < tokens.length; i++) {
    if (tokens[i].type === closeTag && tokens[i].markup === markup) {
      return i;
    }
  }

  return -1;
}

function getAttr(attrs, attrName) {
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i][0] === attrName) {
      return attrs[i][1];
    }
  }
  return false;
}

function getOneEmphasis(tokens, startPos, closePos) {
  let intEmphasis = parseEmphasis(tokens.slice(startPos + 1, closePos)); // eslint-disable-line
  if (Array.isArray(intEmphasis) && intEmphasis.length === 1) {
    intEmphasis = intEmphasis[0];
  }
  if (typeof intEmphasis !== 'string') {
    intEmphasis.length = getTokensLength([intEmphasis]);
  }
  return intEmphasis;
}

/**
 * getUrlToken - Function create url-token
 *
 * @param tokens
 * @param intEmphasis
 * @param num
 * @returns {{type: string, content: [null,null,null,null], length: *}}
 */

function getUrlToken({ tokens, intEmphasis, num }) {
  let urlContent = `(${getAttr(tokens[num].attrs, 'href')})`;
  const urlLength = urlContent.length;
  const punctuation1 = {
    type: "punctuation",
    content: "[",
    length: 1
  };
  const punctuation2 = {
    type: "punctuation",
    content: "]",
    length: 1
  };
  const urlContentObj = {
    type: "punctuation",
    content: urlContent,
    length: urlLength
  };
  let content = Array.isArray(intEmphasis) ?
    [punctuation1, ...intEmphasis, punctuation2, urlContentObj] :
    [punctuation1, intEmphasis, punctuation2, urlContentObj];
  return {
    type: "url",
    content,
    length: Array.isArray(intEmphasis) ? getTokensLength(content) : 1 + intEmphasis.length + 1 + urlLength
  };
}

/**
 * getEmphasisToken - Function create emphasis-token
 *
 * @param tokens
 * @param intEmphasis
 * @param currTag
 * @param num
 * @returns {{type, content, length}}
 */

function getEmphasisToken({ tokens, intEmphasis, currTag, num }) {
  let rawContent = joinArrString(_.flattenDeep([
    tokens[num].markup,
    intEmphasis,
    tokens[num].markup
  ]));
  let contentLength = getTokensLength(rawContent);
  return {
    type: getEmphasisType(currTag),
    content: rawContent,
    length: contentLength
  };
}

/**
 * parseEmphasis - Function parse inline and extract emphasis-tokens
 *
 * @param tokens
 * @returns {Array}
 */

function parseEmphasis(tokens) {
  const newTokens = [];
  let i = 0;
  while (i < tokens.length) {
    if (typeof tokens[i] === 'string') {
      if (tokens[i] !== '') {
        newTokens.push(tokens[i]);
      }
      i++;
    } else {
      const currTag = tokens[i].type;
      if (INLINE_OPEN.indexOf(currTag) !== -1) {
        const closeTag = getCloseTag(currTag);
        const closePos = getClosePos(tokens, i, closeTag, tokens[i].markup);
        if (closePos !== -1) {
          let intEmphasis = getOneEmphasis(tokens, i, closePos);
          if (Array.isArray(intEmphasis) && intEmphasis.length === 0) {
            intEmphasis = '';
          }
          if (currTag === 'link_open') {
            newTokens.push(getUrlToken({ tokens, intEmphasis, num: i }));
          } else {
            newTokens.push(getEmphasisToken({ tokens, intEmphasis, currTag, num: i }));
          }
          i = closePos + 1;
          continue;
        }
      }
      newTokens.push(tokens[i]);
      i++;
    }
  }
  return newTokens;
}

function getListToken(tokens) {
  if (tokens.type === 'ordered-list') {
    tokens.content.content.unshift(`${tokens.start}${tokens.markup} `);
  } else {
    tokens.content.content.unshift(`${tokens.markup} `);
  }
  return {
    type: tokens.type === 'ordered-list' ? 'ordered-list' : 'list',
    content: joinArrString(tokens.content.content),
  };
}

/* eslint-disable */
function getBlockquoteToken(token) {
  token.content = joinArrString(parseBlockquote(token));
  token.length = getTokensLength(token.content);
  delete token.markup;
  return token;
}
/* eslint-enable */

function parseBlock(tokens) {
  if (tokens.type === 'blockquote') {
    return [getBlockquoteToken(tokens)];
  } else if (tokens.type === 'bullet_list' && tokens.content.type === 'list_item' ||
    tokens.type === 'ordered-list' && tokens.content.type === 'list_item') {
    return [getListToken(tokens)];
  }
  return tokens;
}

/**
 * restoreSpaces
 *
 *  Function restore starting and finishing spaces what Markdown-it was deleting
 *
 * @param {string} string - original line
 * @param {Array} tokens
 * @returns {*}
 */

function restoreSpaces(string, tokens) {
  let result = /^\s+$/.exec(string);
  if (result) {
    return [result[0]];
  }

  result = /^[ ]+/.exec(string);
  if (result) {
    if (Array.isArray(tokens) && tokens[0] && tokens[0].content &&
      Array.isArray(tokens[0].content) && typeof tokens[0].content[0] === 'string') {
      tokens[0].content[0] = result[0] + tokens[0].content[0]; // eslint-disable-line
    } else if (Array.isArray(tokens)) {
      tokens.unshift(result[0]);
    } else if (Array.isArray(tokens.content)) {
      tokens.content.unshift(result[0]);
    } else {
      tokens = [result[0], tokens]; // eslint-disable-line
    }

    return tokens;
  }

  result = /[ ]+$/.exec(string);
  if (result) {
    if (Array.isArray(tokens)) {
      tokens.push(result[0]);
    } else if (Array.isArray(tokens.content)) {
      tokens.content.push(result[0]);
    } else {
      tokens = [tokens, result[0]]; // eslint-disable-line
    }
  }

  return tokens;
}

function processEmphasis(tokens) {
  return parseEmphasis(joinArrString(tokens));
}

function processBlockTokens(tokens) {
  let tokensLen = tokens.length;

  if (tokensLen > 0) {
    const firstType = tokens[0].type;
    if (tokensLen === 1) {
      if (firstType === 'hr') {
        return getHRToken(tokens);
      } else if (firstType === 'code_block') {
        return parseCodeBlock(tokens);
      }
    }
    if (tokensLen > 2) {
      const lastType = tokens[tokensLen - 1].type;
      for (let i = 0; i < TOKENS_DATA.length; i++) {
        if (firstType === TOKENS_DATA[i].open && lastType === TOKENS_DATA[i].close) {
          return getBlockContent(tokens, TOKENS_DATA[i].tokenName, tokens[0].markup);
        }
      }
      if (firstType === 'ordered_list_open' && lastType === 'ordered_list_close') {
        const start = tokens[0].attrs ? (getAttr(tokens[0].attrs, 'start') || 1) : 1;
        return getBlockContent(tokens, 'ordered-list', tokens[0].markup, start);
      }
      if (firstType === 'paragraph_open' && lastType === 'paragraph_close') {
        return changeText(tokens[1].children);
      }
      if (firstType === 'heading_open' && lastType === 'heading_close') {
        return [getHeaderContent(tokens, 'header', tokens[0].markup)];
        // return [getHeaderContent(tokens, HEADERS[tokens[0].tag], tokens[0].markup)];
      }
    }
  }

  return tokens;
}

/* eslint-disable */
function processInline(tokens) {
  if (tokens[0] && (tokens[0].type === 'header' ||
      tokens[0].type === 'list' || tokens[0].type === 'ordered-list' ||
      tokens[0].type === 'blockquote')) {
    tokens[0].content = processEmphasis(tokens[0].content);
    tokens[0].length = getTokensLength(tokens[0].content);
    delete tokens[0].markup;
  } else if (Array.isArray(tokens)) {
    tokens = processEmphasis(tokens);
  }

  return tokens;
}
/* eslint-enable */

export const parse = function(string) {
  let tokens = markdown.parse(string, {});
  tokens = processBlockTokens(tokens);
  tokens = parseBlock(tokens);
  tokens = restoreSpaces(string, tokens);
  return processInline(tokens);
};
