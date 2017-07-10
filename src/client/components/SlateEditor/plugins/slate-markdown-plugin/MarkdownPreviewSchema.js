import Prism from 'prismjs';
import React from 'react';
import {Mark} from 'slate';

/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend("markup", {});

Prism.languages.insertBefore("markdown", "prolog", {

  // OK
  blockquote: {
    pattern: /^>(?:[\t ]*>)*.*/m,
    alias: "punctuation",
    inside: {
      punctuation: /^>(?:[\t ]*>)*/
    }
  },

  // OK, except for new line
  code: [{
    pattern: /^(?: {4}|\t).+/m,
    alias: "keyword"
  }, {
    pattern: /``.+?``|`[^`\n]+`/,
    alias: "keyword"
  }],

  // ERROR
  title: [{
    pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
    alias: "important",
    inside: {
      punctuation: /==+$|--+$/
    }
  }, {
    pattern: /(^\s*)#+.+/m,
    lookbehind: true,
    alias: "important",
    inside: {
      punctuation: /^#+|#+$/
    }
  }],

  // OK
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: true,
    alias: "punctuation"
  },

  // ERROR: span after bullet goes through buth should not, like *`code`
  list: {
    pattern: /(^\s*)(?:[*+\-]|\d+\.)(?=$|[\t ])/m,
    lookbehind: true,
    alias: "punctuation"
  },

  "url-reference": {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: {
        pattern: /^(!?\[)[^\]]+/,
        lookbehind: true
      },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[\[\]!:]|[<>]/
    },
    alias: "url"
  },

  // OK
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: true,
    inside: {
      punctuation: /^\*\*|^__|\*\*$|__$/
    }
  },

  // OK
  strikethrough: {
    pattern: /(^|[^\\])(\~\~|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: true,
    inside: {
      punctuation: /^\~\~|^__|\~\~$|__$/
    }
  },

  // OK
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: true,
    inside: {
      punctuation: /^[*_]|[*_]$/
    }
  },

  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: {
        pattern: /(!?\[)[^\]]+(?=\]$)/,
        lookbehind: true
      },
      string: {
        pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
      }
    }
  }
});

Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);


/**
 * Define a decorator for markdown styles.
 *
 * @param {Text} text
 * @param {Block} block
 */

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable();
  const language = 'markdown';
  const string = text.text;
  const grammar = Prism.languages[language];
  const tokens = Prism.tokenize(string, grammar);
  addMarks(characters, tokens, 0);
  return characters.asImmutable();
}

function addMarks(characters, tokens, offset) {
  for (const token of tokens) {
    if (typeof token === 'string') {
      offset += token.length;
      continue
    }

    const {content, length, type} = token;
    const mark = Mark.create({type});

    for (let i = offset; i < offset + length; i++) {
      let char = characters.get(i);
      let {marks} = char;
      marks = marks.add(mark);
      char = char.set('marks', marks);
      characters.set(i, char);
    }

    if (Array.isArray(content)) {
      addMarks(characters, content, offset);
    }

    offset += length;
  }
}


const MarkdownPreviewSchema = {
  marks: {
    'title': {
      fontWeight: 'bold',
      fontSize: '20px',
      margin: '20px 0 10px 0',
      display: 'inline-block'
    },
    'bold': {
      fontWeight: 'bold'
    },
    'italic': {
      fontStyle: 'italic'
    },
    'punctuation': {
      opacity: 0.2
    },
    'blockquote': {
      fontFamily: 'monospace',
      display: 'inline-block',
      padding: '2px 1px',
      fontWeight: 'bold',
      color: 'ForestGreen'
    },
    'code': {
      fontFamily: 'monospace',
      display: 'inline-block',
      padding: '2px 1px',
    },
    'list': {
      paddingLeft: '10px',
      lineHeight: '10px',
      fontSize: '20px'
    },
    'hr': {
      borderBottom: '2px solid #000',
      display: 'block',
      opacity: 0.2
    },
    'strikethrough': {
      textDecoration: 'line-through'
    },
    'url': {
      color: 'red'
    },
    'variable': {
      color: 'blue'
    }
  },
  rules: [
    {
      match: () => true,
      decorate: markdownDecorator,
    }
  ]
};

export default MarkdownPreviewSchema;
