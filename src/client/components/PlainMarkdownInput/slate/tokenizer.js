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

function getTokensLength(tokens) {
  if (typeof tokens === 'string') {
    return tokens.length;
  }
  return tokens.reduce((acc, token) => {
    return acc + (token.length ? token.length : 0);
  }, 0);
}

function getHeaderContent(tokens, type, markup = '') {
  const content = {
    type: type,
    content: changeText(tokens[1].children, markup)
  };
  content.length = getTokensLength(content.content);
  return content;
}

function getBlockContent(tokens, type, markup = '') {
  const content = {
    type: type,
    content: processBlockTokens(tokens.slice(1, -1)) // eslint-disable-line
  };
  if (markup !== '') {
    content.markup = markup;
  }
  return content;
}

const HEADERS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6'
};
const HEADERS_STR = [
  'header1',
  'header2',
  'header3',
  'header4',
  'header5',
  'header6'
];
const EMPHASISES = {
  strong: 'bold',
  em: 'italic',
  s: 'strikethrough',
  link: 'url'
};
const INLINE_OPEN = [
  'strong_open', 's_open', 'em_open', 'link_open'
];

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
    length: 3
  }]
}

function parseCodeBlock(tokens) {
  let res = /^[\+\-\*](?= )/.test(tokens[0].content);
  if (!res && tokens[0].markup === '') {
    return [tokens[0].content];
  } else {
    const content = {
      type: 'list',
      content: [tokens[0].content],
      markup: res[0]
    };
    return [content];
  }
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

function getUrlToken({ tokens, intEmphasis, num }) {
  let urlContent = `(${getAttr(tokens[num].attrs, 'href')})`;
  urlContent = urlContent.length > 0 ? urlContent : '';
  const urlLength = urlContent.length;
  return {
    type: "url",
    content: [
      {
        type: "punctuation",
        content: "[",
        length: 1
      },
      intEmphasis,
      {
        type: "punctuation",
        content: "]",
        length: 1
      },
      {
        type: "punctuation",
        content: urlContent,
        length: urlLength
      }
    ],
    length: 1 + intEmphasis.length + 1 + urlLength
  };
}

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
  tokens.content.content.unshift(`${tokens.markup} `);
  return {
    type: 'list',
    content: joinArrString(tokens.content.content),
  };
}

/* eslint-disable */
function getBlockquoteToken(token) {
  token.content = joinArrString(parseBlockquote(token));
  token.length = getTokensLength(token.content);
  delete token.markup; // eslint-disable-line
  return token;
}
/* eslint-enable */

function parseBlock(tokens) {
  if (tokens.type === 'blockquote') {
    return [getBlockquoteToken(tokens)];
  } else if (tokens.type === 'bullet_list' && tokens.content.type === 'list_item') {
    return [getListToken(tokens)];
  }
  return tokens;
}

function processBlockTokens(tokens) {
  let tokensLen = tokens.length;

  if (tokensLen === 1) {
    if (tokens[0].type === 'hr') {
      return getHRToken(tokens);
    } else if (tokens[0].type === 'code_block') {
      return parseCodeBlock(tokens);
    }
  }

  if (tokensLen > 2) {
    if (tokens[0].type === 'blockquote_open' &&
      tokens[tokensLen - 1].type === 'blockquote_close') {
      return getBlockContent(tokens, 'blockquote', tokens[0].markup);
    }
    if (tokens[0].type === 'bullet_list_open' &&
      tokens[tokensLen - 1].type === 'bullet_list_close') {
      return getBlockContent(tokens, 'bullet_list', tokens[0].markup);
    }
    if (tokens[0].type === 'list_item_open' &&
      tokens[tokensLen - 1].type === 'list_item_close') {
      return getBlockContent(tokens, 'list_item', tokens[0].markup);
    }
    if (tokens[0].type === 'paragraph_open' &&
      tokens[tokensLen - 1].type === 'paragraph_close') {
      return changeText(tokens[1].children);
    }
    if (tokens[0].type === 'heading_open' &&
      tokens[tokensLen - 1].type === 'heading_close') {
      return [getHeaderContent(tokens, HEADERS[tokens[0].tag], tokens[0].markup)];
    }
  }
  return tokens;
}

function restoreSpaces(string, tokens) {
  let result = /^[ ]+/.exec(string);
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

function processInline(string, oldTokens) {
  let tokens = parseBlock(oldTokens);
  tokens = restoreSpaces(string, tokens);

  if (tokens[0] && (HEADERS_STR.indexOf(tokens[0].type) !== -1 || tokens[0].type === 'list' ||
      tokens[0].type === 'blockquote')) {
    tokens[0].content = joinArrString(tokens[0].content);
    tokens[0].content = parseEmphasis(tokens[0].content);
    tokens[0].length = getTokensLength(tokens[0].content);
  } else if (Array.isArray(tokens)) {
    tokens = joinArrString(tokens);
    tokens = parseEmphasis(tokens);
  }

  return tokens;
}

export const parse = function(string) {
  let tokens = markdown.parse(string, {});
  tokens = processBlockTokens(tokens);
  tokens = processInline(string, tokens);
  return tokens;
};
