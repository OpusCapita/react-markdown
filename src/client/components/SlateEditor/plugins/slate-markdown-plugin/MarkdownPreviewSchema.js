import Prism from 'prismjs';
import { Mark } from 'slate';

/**
 * Add the markdown syntax to Prism.
 */

// eslint-disable-next-line
Prism.languages.markdown = Prism.languages.extend("markup", {});

Prism.languages.insertBefore('markdown', 'prolog', {
  blockquote: {
    pattern: /^>(?:[\t ]*>)*.*/m
  },
  code: [{
    pattern: /```[^`]+```/g,
    greedy: true
  }, {
    pattern: /`[^`]+`/g,
    greedy: true
  }],
  // codeBlock: [{
  //   pattern: /^`{3}([\S]+)?\n([\s\S]+)\n`{3}/
  // }],
  header1: {
    pattern: /(^\s*)#{1}[\s]+.*/m
  },
  header2: {
    pattern: /(^\s*)#{2}[\s]+.*/m
  },
  header3: {
    pattern: /(^\s*)#{3}[\s]+.*/m
  },
  header4: {
    pattern: /(^\s*)#{4}[\s]+.*/m
  },
  header5: {
    pattern: /(^\s*)#{5}[\s]+.*/m
  },
  header6: {
    pattern: /(^\s*)#{6}[\s]+.*/m
  },
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m
  },
  list: {
    pattern: /^\s*[\+\-\*]\s.+/
  },
  url: {
		pattern: /!?\[[^\]]*\](?:\([^)]*(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      punctuation: {
        pattern: /[\[\]!:]|[<>]|\(.*\)/
      }
		}
  },

  bold: [{
    pattern: /(^|[^_*])__([^_\r\n]*(_[^_\r\n]+_[^_\r\n]*)+|[^\r\n]+)__/,
    lookbehind: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)_[^_\r\n]+_(?=.{2,})/
      }, {
        pattern: /\*[^*\r\n]+\*/
      }]
    }
  }, {
    pattern: /(^|[^_*])\*\*([^\*\r\n]*(\*[^\*\r\n]+\*[^\*\r\n]*)+|[^*\r\n]+)\*\*/,
    lookbehind: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)\*[^\*\r\n]+\*(?=.{2,})/
      }, {
        pattern: /_[^_\r\n]+_/
      }]
    }
  }],
  italic: [{
    pattern: /_([^_\r\n]*(__[^_\r\n]+__[^_\r\n]*)+|[^_\r\n]+).*_(?=\b)/,
    inside: {
      bold: [{
        lookbehind: true,
        pattern: /(.+?)__[^_\r\n]+__(?=.+)/
      }, {
        pattern: /\*\*[^*\r\n]+\*\*/
      }]
    }
  }, {
    pattern: /\*([^*r\n]*(\*\*[^*\r\n]+\*\*[^*\r\n]*)+|[^*\r\n]+).*(?=\b)\*/,
    inside: {
      bold: [{
        lookbehind: true,
        pattern: /(.+?)__[^_\r\n]+__(?=.+)/
      }, {
        pattern: /__[^_\r\n]+__/
      }]
    }
  }],

  strikethrough: {
    pattern: /(^|[^~])~~([^~\r\n]*(~~[^~\r\n]+~~[^~\r\n]*)+|[^~\r\n]+)~/,
    lookbehind: true,
    inside: {}
  }
});

// Prism.languages.markdown.strikethrough.inside.italic = [
//   Prism.util.clone(Prism.languages.markdown.italic[0]),
//   Prism.util.clone(Prism.languages.markdown.italic[1]),
// ];

// Prism.languages.markdown.strikethrough.inside.bold = [
//   Prism.util.clone(Prism.languages.markdown.bold[0]),
//   Prism.util.clone(Prism.languages.markdown.bold[1]),
// ];

// Prism.languages.markdown.bold[0].inside.italic = Prism.util.clone(Prism.languages.markdown.italic[0]);
// Prism.languages.markdown.bold[1].inside.italic = Prism.util.clone(Prism.languages.markdown.italic[1]);
// Prism.languages.markdown.italic[0].inside.bold = Prism.util.clone(Prism.languages.markdown.bold[0]);
// Prism.languages.markdown.italic[1].inside.bold = Prism.util.clone(Prism.languages.markdown.bold[1]);
// Prism.languages.markdown.url.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
// Prism.languages.markdown.url.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);

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
      left: '-2ch'
    },
    'hr': {
      display: 'block'
    },
    'strikethrough': {
      textDecoration: 'line-through'
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
export const grammar = Prism.languages.markdown;
