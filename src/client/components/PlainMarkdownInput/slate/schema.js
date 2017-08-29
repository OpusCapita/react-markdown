import React from 'react';
import Types from 'prop-types';
import Prism from 'prismjs';
import { Mark } from '@opuscapita/slate';

/**
 * Create regExp which parses that cases:
 *
 * 1. _italic_ simple _italic_
 *
 * 2. _italic __bold__ italic_ simple _italic_
 *
 * 3. _italic_italic italic__ simple _italic_
 *    _italic italic_italic_ simple _italic_
 *
 * 4. __italic_italic italic_ simple _italic_
 *
 * 5. ___bold__ italic_
 *
 * 6. _italic __bold___
 */
const italicStr = [
  '\\b((_(?!(_| ))[^\\s]*_)',
  '|_(?!(_| ))(([^_\\r\\n]_?)*[^_\\r\\n])\\b__(([^_\\r\\n]_?)*[^_\\s ])__\\b',
  '([^_\\r\\n]_?)*?[^_\\s ]_',
  '|_(?!(_| ))(([^_\\r\\n]_?)*?[^_\\r\\n])(_|__)',
  '|__(([^_\\r\\n]_?)*?[^_\\r\\n])_)\\b',
  '|\\b(___(?! )(([^\\r\\n]_?)*?[^\\s_])_',
  '|_(?! )(([^\\r\\n]_?)*?[^\\s_])___)\\b'
].join('');
const italicRegExp = new RegExp(italicStr, 'm');

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
    pattern: /^#{1}[\s]+.*$/m,
    inside: {}
  },
  header2: {
    pattern: /^#{2}[\s]+.*$/m,
    inside: {}
  },
  header3: {
    pattern: /^#{3}[\s]+.*$/m,
    inside: {}
  },
  header4: {
    pattern: /^#{4}[\s]+.*$/m,
    inside: {}
  },
  header5: {
    pattern: /^#{5}[\s]+.*$/m,
    inside: {}
  },
  header6: {
    pattern: /^#{6}[\s]+.*$/m,
    inside: {}
  },
  'header-no-offset': {
    pattern: /(^\s{1,3})#{1,6}[\s]+.*$/m,
    inside: {}
  },
  list: [{
    pattern: /^( *[\+\-\*] .*)/m,
    inside: {}
  }],
  'ordered-list': [{
    pattern: /^( *\d+\. .*)/m,
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
    pattern: /(^|[^`])(```|`)[^`\n\r]*[^`\n\r]\2(?!`)/m,
    lookbehind: true,
  }],
  codeblock: [{
    pattern: /^```(?: *)(\n[^`]*)*\n```(?: *)/m,
    inside: {}
  }],
  bold: [{
    pattern: /(^|[^*])\*\*([^\*\r\n]*(\*[^\*\r\n]+\*[^\*\r\n]*)+|[^*\r\n]+)\*\*/m,
    lookbehind: true,
    greedy: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)\*[^\*\r\n]+\*(?=.{2,})/m,
        inside: {}
      }, {
        pattern: /_[^_\r\n]+_/m,
        inside: {}
      }]
    }
  }, {
    pattern: /(^|[^_]\b)__((([^_\r\n]_?)*[^_\r\n])|[^\r\n_]+)__\b/m,
    lookbehind: true,
    greedy: true,
    inside: {
      italic: [{
        lookbehind: true,
        pattern: /(.{2,}?)_([^_\s]_?)*[^_\s]_(?=.{2,})/,
        inside: {}
      }, {
        pattern: /\*[^*\r\n]+\*/,
        inside: {}
      }]
    }
  }],
  italic: [{
    pattern: /([^*]|^)\*([^*\r\n]*(\*\*[^*\r\n]+\*\*[^*\r\n]*)+|[^*\r\n]+)\*/m,
    lookbehind: true,
    greedy: true,
    inside: {
      bold: [{
        pattern: /(\b)__([^_\r\n]).+__(?=\b)/m,
        lookbehind: true,
        inside: {}
      }, {
        lookbehind: true,
        pattern: /(.+?)\*\*[^*\r\n]+\*\*(?=.+)/m,
        inside: {}
      }]
    }
  }, {
    pattern: italicRegExp,
    greedy: true,
    inside: {
      bold: [{
        lookbehind: true,
        pattern: /(.+?)__([^_\r\n]+_?)*[^_\r\n]+__(?=.+)/m,
        inside: {}
      }, {
        lookbehind: true,
        pattern: /(.+?)\*\*[^*\r\n]+\*\*(?=.+)/m,
        inside: {}
      }]
    }
  }],
  strikethrough: {
    pattern: /~~[^~\r\n].+[^~\r\n]~~/m,
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
  if (props.node.type === 'multiline') {
    return (<div className="oc-md-hl-block">{props.children}</div>);
  }

  if (props.mark) {
    let markType = props.mark.type;
    const className = 'oc-md-hl-' + markType;
    let content = props.children;

    if (markType === 'hr') {
      return (
        <span><span className={className}>{content}</span><br/></span>
      );
    } else {
      return (
        <span className={className}>{content}</span>
      );
    }
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

    addMarks(characters, content, updatedOffset);

    const mark = Mark.create({ type });
    for (let i = updatedOffset; i < updatedOffset + length; i++) {
      let char = characters.get(i);
      let { marks } = char;

      marks = marks.add(mark);
      char = char.set('marks', marks);
      characters.set(i, char);
    }

    updatedOffset += length;
  }
}

/**
 * Object caches the last values of tokens and characters
 * if the text hasn't changed, returns characters from the cache
 * if the text has changed, tokens and characters are recalculated and save in a cache
 */
const charactersCache = {
  lastText: null,
  lastTokens: null,
  characters: null,

  getCharacters(text) {
    if (text.text !== this.lastText || !this.characters) {
      let characters = text.characters.asMutable();
      const grammar = Prism.languages.markdown;
      this.lastText = text.text;
      this.lastTokens = Prism.tokenize(text.text, grammar);
      addMarks(characters, this.lastTokens, 0); // Add marks to characters
      this.characters = characters.asImmutable();
    }

    return this.characters;
  }
};

const schema = {
  rules: [{
    match: () => true,
    decorate: charactersCache.getCharacters.bind(charactersCache),
    render: rendererComponent
  }]
};

export const createCustomCharacters = editorState => {
  const { focusText } = editorState;
  // eslint-disable-next-line
  editorState.customCharacters = charactersCache.getCharacters(focusText);
  return editorState;
};

export default schema;
export const grammar = Prism.languages.markdown;
