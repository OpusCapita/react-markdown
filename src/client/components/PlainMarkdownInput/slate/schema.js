import React from 'react';
import Types from 'prop-types';
import Prism from 'prismjs';
import { Mark } from 'slate';
import MarkdownIt from 'markdown-it';
import _ from 'lodash';

const markdown = new MarkdownIt({
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  // Enable some language-neutral replacement + quotes beautification
  typographer:  false
});


/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend("markup", {});

Prism.languages.insertBefore('markdown', 'prolog', {
  blockquote: {
    pattern: /^>(?:[\t ]*>)*.*/m,
    inside: {}
  },
  header1: {
    pattern: /^#{1}[\s]+.*$/,
    inside: {}
  },
  header2: {
    pattern: /^#{2}[\s]+.*/,
    inside: {}
  },
  header3: {
    pattern: /^#{3}[\s]+.*/,
    inside: {}
  },
  header4: {
    pattern: /^#{4}[\s]+.*/,
    inside: {}
  },
  header5: {
    pattern: /^#{5}[\s]+.*/,
    inside: {}
  },
  header6: {
    pattern: /^#{6}[\s]+.*/,
    inside: {}
  },
  'header-no-offset': {
    pattern: /(^\s{1,3})#{1,6}[\s]+.*$/,
    inside: {}
  },
  list: [{
    pattern: /^\s*[\+\-\*](\s).*/,
    inside: {}
  }],
  'ordered-list': [{
    pattern: /^\s*\d\.(\s).*/,
    inside: {}
  }],
  url: {
    pattern: /!?\[[^\]]*\](?:\([^)]*(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      punctuation: {
        pattern: /[\[\]!:]|[<>]|\(.*\)/
      }
    }
  },
  code: [{
    pattern: /(^|[^`])```[^`\n\r]*[^`\n\r]```(?!`)/,
    lookbehind: true,
    inside: {}
  }, {
    pattern: /(^|[^`])`[^`\n\r]*[^`\n\r]`(?!`)/,
    lookbehind: true,
  }],
  bold: [{
    pattern: /(^|[^*])\*\*([^\*\r\n]*(\*[^\*\r\n]+\*[^\*\r\n]*)+|[^*\r\n]+)\*\*/,
    lookbehind: true,
    greedy: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)\*[^\*\r\n]+\*(?=.{2,})/,
        inside: {}
      }, {
        pattern: /_[^_\r\n]+_/,
        inside: {}
      }]
    }
  }, {
    pattern: /(^|[^_]\b)__([^_\r\n]*(_[^_\r\n]+_[^_\r\n]*)+|[^\r\n]+)__/,
    lookbehind: true,
    greedy: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)_[^_\r\n]+_(?=.{2,})/,
        inside: {}
      }, {
        pattern: /\*[^*\r\n]+\*/,
        inside: {}
      }]
    }
  }],
  italic: [{
    pattern: /([^*]|^)\*([^*\r\n]*(\*\*[^*\r\n]+\*\*[^*\r\n]*)+|[^*\r\n]+)\*/,
    lookbehind: true,
    greedy: true,
    inside: {
      bold: [{
        pattern: /(\b)__([^_\r\n]).+__(?=\b)/,
        lookbehind: true,
        inside: {}
      }, {
        lookbehind: true,
        pattern: /(.+?)\*\*[^*\r\n]+\*\*(?=.+)/,
        inside: {}
      }]
    }
  }, {
    pattern: /(?=\b)_[^]*([^_\r\n]*(__[^_\r\n]+__[^_\r\n]*)+|[^_\r\n]+)[^]*_(?=\b)/,
    greedy: true,
    inside: {
      bold: [{
        lookbehind: true,
        pattern: /(.+?)__[^_\r\n]+__(?=.+)/,
        inside: {}
      }, {
        lookbehind: true,
        pattern: /(.+?)\*\*[^*\r\n]+\*\*(?=.+)/,
        inside: {}
      }]
    }
  }],
  strikethrough: {
    pattern: /~~[^~\r\n].+[^~\r\n]~~/,
    greedy: true,
    inside: {}
  },
  hr: {
    pattern: /(^\s{0,3})[-*]{3,}[\s]*$/,
    lookbehind: true
  }
});

Prism.languages.markdown.strikethrough.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.strikethrough.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.strikethrough.inside.url = Prism.util.clone(Prism.languages.markdown.url);

Prism.languages.markdown.bold[0].inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.bold[1].inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.italic[0].inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.italic[1].inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);

Prism.languages.markdown.bold[0].inside.italic[0].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.bold[0].inside.italic[1].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.bold[1].inside.italic[0].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.bold[1].inside.italic[1].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);

Prism.languages.markdown.italic[0].inside.bold[0].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.italic[0].inside.bold[1].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.italic[1].inside.bold[0].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.italic[1].inside.bold[1].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);

Prism.languages.markdown.url.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.url.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.url.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);

Prism.languages.markdown.bold[0].inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.bold[1].inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.italic[0].inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.italic[1].inside.url = Prism.util.clone(Prism.languages.markdown.url);

Prism.languages.markdown.header1.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header2.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header3.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header4.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header5.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header6.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown['header-no-offset'].inside.url = Prism.util.clone(Prism.languages.markdown.url);

Prism.languages.markdown.header1.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header2.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header3.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header4.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header5.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header6.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown['header-no-offset'].inside.bold = Prism.util.clone(Prism.languages.markdown.bold);

Prism.languages.markdown.header1.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header2.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header3.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header4.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header5.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header6.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown['header-no-offset'].inside.italic = Prism.util.clone(Prism.languages.markdown.italic);

Prism.languages.markdown.header1.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header2.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header3.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header4.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header5.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header6.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown['header-no-offset'].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);

Prism.languages.markdown.header1.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.header2.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.header3.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.header4.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.header5.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.header6.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown['header-no-offset'].inside.code = Prism.util.clone(Prism.languages.markdown.code);

Prism.languages.markdown.list[0].inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.list[0].inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.list[0].inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.list[0].inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.list[0].inside.url = Prism.util.clone(Prism.languages.markdown.url);

Prism.languages.markdown['ordered-list'][0].inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown['ordered-list'][0].inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown['ordered-list'][0].inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown['ordered-list'][0].inside.strikethrough =
  Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown['ordered-list'][0].inside.url = Prism.util.clone(Prism.languages.markdown.url);

Prism.languages.markdown.blockquote.inside.code = Prism.util.clone(Prism.languages.markdown.code);
Prism.languages.markdown.blockquote.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.blockquote.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.blockquote.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.blockquote.inside.url = Prism.util.clone(Prism.languages.markdown.url);

let rendererComponent = props => {
  let isLine = props.node.type === 'line';
  let hasMarks = props.mark;

  if (isLine) {
    return (<div className="oc-md-hl-block">{props.children}</div>);
  }

  if (hasMarks && props.mark.type === 'code') {
    const className = props.mark ? 'oc-md-hl-' + props.mark.type : '';

    if (typeof props.children === 'string') {
      /* Wrap <span>children</span> - set cursor properly on mouse click inside "code" node */
      return (
        <span className={className}>
          <span>{props.children}</span>
          <span className="oc-md-hl-code-background"></span>
        </span>
      );
    }

    return (
      <span className={className}>
        {props.children}
        <span className="oc-md-hl-code-background"></span>
      </span>
    );
  }

  if (hasMarks) {
    const className = props.mark ? 'oc-md-hl-' + props.mark.type : '';
    return (
      <span className={className}>
        {props.children}
      </span>
    );
  }

  return null;
};

rendererComponent.propTypes = {
  node: Types.object,
  mark: Types.object
};

/**
 * Define a decorator for markdown styles.
 */

function addMarks(characters, tokens, offset) {
  let updatedOffset = offset;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (typeof token === 'string') {
      updatedOffset += token.length;
      continue;
    }

    const { content, length, type } = token;
    const mark = Mark.create({ type });

    for (let i = updatedOffset; i < updatedOffset + length; i++) {
      let char = characters.get(i);
      let { marks } = char;

      marks = marks.add(mark);
      char = char.set('marks', marks);
      characters.set(i, char);
    }

    if (Array.isArray(content)) {
      addMarks(characters, content, updatedOffset);
    }

    updatedOffset += length;
  }
}

function changeText(tokens, markup = '') {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'text') {
      tokens[i] = (i === 0 && markup !== '' ? `${markup} ` : '') + tokens[i].content;
    } else if (tokens[i].type === 'code_inline') {
      let content = `${tokens[i].markup}${tokens[i].content}${tokens[i].markup}`;
      let length = content.length;
      if (tokens[i].markup === '```') {
        content = [content];
      }
      tokens[i] = {
        type: "code",
        content,
        length,
        greedy: false
      };
    }
  }
  return tokens;
}

function getTokensLength(tokens) {
  if (typeof token === 'string') {
    return token.length;
  }
  return tokens.reduce((acc, token) => {
    // if (typeof token === 'string') {
    //   return token.length;
    // }
    return acc + (token.length ? token.length : 0);
  }, 0);
}

function getHeaderContent(tokens, type, markup = '') {
  const content = {
    type: type,
    content: changeText(tokens[1].children, markup),
    greedy: false
  };
  content.length = getTokensLength(content.content);
  return content;
}

function getContent(tokens, type, markup = '') {
  const content = {
    type: type,
    content: preprocessTokens(tokens.slice(1, -1))
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
    token = parseBlockquote(token.content);
    token.unshift('>');
  } else {
    token.unshift(' ');
  }
  return token;
}

function preprocessTokens(tokens) {
  let tokensLen = tokens.length;

  if (tokens.length === 1) {
    if (tokens[0].type === 'hr') {
      return [{
        type: "hr",
        content: tokens[0].markup,
        length: 3,
        greedy: false
      }]
    } else if (tokens[0].type === 'code_block' &&
      !/^[\+\-\*]/.test(tokens[0].content) && tokens[0].markup === '') {
      return [tokens[0].content];
    }
  }

  if (tokens.length > 2) {
    if (tokens[0].type === 'blockquote_open' &&
      tokens[tokensLen - 1].type === 'blockquote_close') {
      return getContent(tokens, 'blockquote', tokens[0].markup);
    }
    if (tokens[0].type === 'bullet_list_open' &&
      tokens[tokensLen - 1].type === 'bullet_list_close') {
      return getContent(tokens, 'bullet_list', tokens[0].markup);
    }
    if (tokens[0].type === 'list_item_open' &&
      tokens[tokensLen - 1].type === 'list_item_close') {
      return getContent(tokens, 'list_item', tokens[0].markup);
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

const EMPHASISES = {
  strong: 'bold',
  em: 'italic',
  s: 'strikethrough',
  link: 'url'
};

function getEmphasisType(openTag) {
  return EMPHASISES[openTag.split('_')[0]];
}

function getCloseTag(openTag) {
  return `${openTag.split('_')[0]}_close`;
}

function getClosePos(tokens, startPos, closeTag) {
  for (let i = startPos + 1; i < tokens.length; i++) {
    if (tokens[i].type === closeTag) {
      return i;
    }
  }

  return -1;
}

function getAttr(attrs, attrName) {
  let attr = null;
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i][0] === attrName) {
      return attrs[i][1];
    }
  }
  return false;
}

function getOneEmphasis(tokens, startPos, closePos) {
  let intEmphasis = parseEmphasis(tokens.slice(startPos + 1, closePos));
  if (Array.isArray(intEmphasis) && intEmphasis.length === 1) {
    intEmphasis = intEmphasis[0];
  }
  if (typeof intEmphasis !== 'string') {
    intEmphasis.length = getTokensLength([intEmphasis]);
  }
  return intEmphasis;
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
      if (currTag === 'strong_open' ||
        currTag === 's_open' ||
        currTag === 'em_open' ||
        currTag === 'link_open') {
        const closeTag = getCloseTag(currTag);
        const closePos = getClosePos(tokens, i, closeTag);
        if (closePos !== -1) {
          if (currTag === 'link_open') {
            let urlContent = `(${getAttr(tokens[i].attrs, 'href')})`;
            urlContent = urlContent.length > 0 ? urlContent : '';
            let intEmphasis = getOneEmphasis(tokens, i, closePos);
            const urlLength = urlContent.length;
            const newToken = {
              type: "url",
              content: [
                {
                  type: "punctuation",
                  content: "[",
                  length: 1,
                  greedy: false
                },
                intEmphasis,
                {
                  type: "punctuation",
                  content: "]",
                  length: 1,
                  greedy: false
                },
                {
                  type: "punctuation",
                  content: urlContent,
                  length: urlLength,
                  greedy: false
                }
              ],
              length: 1 + intEmphasis.length + 1 + urlLength,
              greedy: false
            };
            newTokens.push(newToken);
          } else {
            let intEmphasis = getOneEmphasis(tokens, i, closePos);
            let rawContent = joinArrString(_.flattenDeep([
              tokens[i].markup,
              intEmphasis,
              tokens[i].markup
            ]));
            let contentLength = getTokensLength(rawContent);
            newTokens.push({
              type: getEmphasisType(currTag),
              content: rawContent,
              length: contentLength,
              greedy: true
            });
          }
          i = closePos + 1;
        } else {
          newTokens.push(tokens[i]);
          i++;
        }
      } else {
        newTokens.push(tokens[i]);
        i++;
      }
    }
  }
  return newTokens;
}

function process1(string, tokens) {
  if (tokens.type === 'blockquote') {
    tokens.content = joinArrString(parseBlockquote(tokens));
    tokens.length = getTokensLength(tokens.content);
    tokens.greedy = false;
    delete tokens.markup;
    tokens = [tokens];
  } else if (tokens.type === 'bullet_list' && tokens.content.type === 'list_item') {
    tokens.content.content.unshift(`${tokens.markup} `);
    tokens.type = 'list';
    tokens = [{
      type: 'list',
      content: joinArrString(tokens.content.content),
    }];
  }

  let result = /^[ ]+/.exec(string);
  if (result) {
    if (Array.isArray(tokens)) {
      tokens.unshift(result[0]);
    } else if (Array.isArray(tokens.content)) {
      tokens.content.unshift(result[0]);
    } else {
      tokens = [result[0], tokens];
    }
  }

  result = /[ ]+$/.exec(string);
  if (result) {
    if (Array.isArray(tokens)) {
      tokens.push(result[0]);
    } else if (Array.isArray(tokens.content)) {
      tokens.content.push(result[0]);
    } else {
      tokens = [tokens, result[0]];
    }
  }

  if (Array.isArray(tokens)) {
    tokens = joinArrString(tokens);
    tokens = parseEmphasis(tokens);
  } else if (Array.isArray(tokens.content)) {
    tokens.content = joinArrString(tokens.content);
    tokens.content = parseEmphasis(tokens.content);
  }

  return tokens;
}

function getTokens(string) {
  let tokens = markdown.parse(string, {});
  tokens = preprocessTokens(tokens);
  tokens = process1(string, tokens);
  return tokens;
}

let cache = {
  text: '',
  tokens: null,
  markers: null
};

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable();
  const language = 'markdown';
  const string = text.text;

  if (string !== cache.text) {
    cache.text = string;
    // const grammar = Prism.languages[language];
    // cache.tokens = Prism.tokenize(string, grammar);
    cache.markers = getTokens(string);

    // console.log(' ');
    // console.log(string);
    // // console.log(JSON.stringify(cache.tokens));
    // console.log(JSON.stringify(cache.markers));
  }
  addMarks(characters, cache.markers, 0);
  // addMarks(characters, cache.tokens, 0);
  return characters.asImmutable();
}

const schema = {
  rules: [{
    match: () => true,
    decorate: markdownDecorator,
    render: rendererComponent
  }]
};
export default schema;
export const grammar = Prism.languages.markdown;
