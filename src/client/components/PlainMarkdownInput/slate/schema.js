import React from 'react';
import Types from 'prop-types';
import Prism from 'prismjs';
import { Mark } from 'slate';

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
  header: {
    pattern: /^#{1,6}[\s]+.*$/,
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

Prism.languages.markdown.header.inside.url = Prism.util.clone(Prism.languages.markdown.url);
Prism.languages.markdown.header.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
Prism.languages.markdown.header.inside.italic = Prism.util.clone(Prism.languages.markdown.italic);
Prism.languages.markdown.header.inside.strikethrough = Prism.util.clone(Prism.languages.markdown.strikethrough);
Prism.languages.markdown.header.inside.code = Prism.util.clone(Prism.languages.markdown.code);

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

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable();
  const language = 'markdown';
  const string = text.text;
  const grammar = Prism.languages[language];
  const tokens = Prism.tokenize(string, grammar);

  addMarks(characters, tokens, 0);
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
