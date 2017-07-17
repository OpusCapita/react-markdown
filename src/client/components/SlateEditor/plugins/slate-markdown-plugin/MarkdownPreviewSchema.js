import Prism from 'prismjs';
import { Mark } from 'slate';

/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend("markup", {});

Prism.languages.insertBefore("markdown", {

  // OK
  blockquote: {
    pattern: /^>(?:[\t ]*>)*.*/m
  },

  // OK, except for new line
  code: [{
    pattern: /\`\`\`[^\`]+\`\`\`/,
    lookbehid: true
  }, {
    pattern: /\`[^\`][^\n\r]*?\`/,
    lookbehid: true
  }],

  header1: [{
    pattern: /(^\s*)#{1}[\s]+.*/m,
    lookbehind: true
  }],

  header2: [{
    pattern: /(^\s*)#{2}[\s]+.*/m,
    lookbehind: true
  }],

  header3: [{
    pattern: /(^\s*)#{3}[\s]+.*/m,
    lookbehind: true
  }],

  header4: [{
    pattern: /(^\s*)#{4}[\s]+.*/m,
    lookbehind: true
  }],

  header5: [{
    pattern: /(^\s*)#{5}[\s]+.*/m,
    lookbehind: true
  }],

  header6: [{
    pattern: /(^\s*)#{6}[\s]+.*/m,
    lookbehind: true
  }],

  // OK
  // TODO - check how looks in iA Writer
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: true
  },

  // ERROR: span after bullet goes through buth should not, like *`code`
  list: {
    pattern: /(^\s*)(?:[*+\-]|\d+\.)(?=$|[\t ])/,
    lookbehind: true,
  },

  "url-reference": {
    // eslint-disable-next-line
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
  bold: [{
    pattern: /(^|[^\\*])\*\*[^*][^\n\r]*?\*\*/,
    lookbehind: true
  }, {
    pattern: /(^|[^\\_])__[^_][^\n\r]*?__/,
    lookbehind: true
  }],

  // OK
  strikethrough: {
    pattern: /(^|[^\\])(\~\~)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: true
  },

  // OK
  italic: [{
    pattern: /(^|[^\\*])\*[^*][^\n\r]*?\*/,
    lookbehind: true
  }, {
    pattern: /(^|[^\\_])_[^_][^\n\r]*?_/,
    lookbehind: true
  }],

  boldItalic: [{
    pattern: /(^|[^\\*])\*\*\*[^*][^\n\r]*?\*\*\*/,
    lookbehind: true
  }, {
    pattern: /(^|[^\\_])___[^_][^\n\r]*?___/,
    lookbehind: true
  }],

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

// Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url);
// Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url);
// Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
// Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);


/**
 * Define a decorator for markdown styles.
 *
 * @param {Text} text
 * @param {Block} block
 */

function addMarks(characters, tokens, offset) {
  let updatedOffset = offset;
  for (const token of tokens) {
    if (typeof token === 'string') {
      updatedOffset += token.length;
      continue
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

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable();
  const language = 'markdown';
  const string = text.text;
  const grammar = Prism.languages[language];
  const tokens = Prism.tokenize(string, grammar);
  addMarks(characters, tokens, 0);
  return characters.asImmutable();
}

const headerStyle = {
  fontWeight: 'bold',
  display: 'block',
  position: 'relative'
};
const MarkdownPreviewSchema = {
  marks: {
    'header1': { ...headerStyle, left: '-2ch' },
    'header2': { ...headerStyle, left: '-3ch' },
    'header3': { ...headerStyle, left: '-4ch' },
    'header4': { ...headerStyle, left: '-5ch' },
    'header5': { ...headerStyle, left: '-6ch' },
    'header6': { ...headerStyle, left: '-7ch' },
    'bold': {
      fontWeight: 'bold'
    },
    'italic': {
      fontStyle: 'italic'
    },
    'boldItalic': {
      fontStyle: 'italic',
      fontWeight: 'bold'
    },
    'punctuation': {
      color: '#777'
    },
    'blockquote': {
      display: 'inline-block'
    },
    'code': {
      display: 'inline-block',
      backgroundColor: '#eee'
    },
    'codeBlock': {
      display: 'block',
      backgroundColor: '#eee'
    },
    'list': {
      position: 'relative',
      backgroundColor: '#777',
      left: '-2ch'
    },
    'hr': {
      display: 'block',
      color: '#777'
    },
    'strikethrough': {
      textDecoration: 'line-through'
    },
    'url': {
      color: '#777'
    },
    'variable': {
      color: 'blue'
    }
  },
  rules: [
    {
      match: () => true,
      decorate: markdownDecorator
    }
  ]
};

export default MarkdownPreviewSchema;
