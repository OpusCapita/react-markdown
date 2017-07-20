import MarkdownParser from './MarkdownParser'
import {Raw} from 'slate'
import {Record} from 'immutable'


/**
 * String.
 */

const String = new Record({
  kind: 'string',
  text: ''
});

const AFTER_HEADINGS_WITHOUT_SUFFIX = new Set([
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
]);

const MARKUPS = {
  code: '`',
  underline: '++',
  sup: '^',
  sub: '~',
  strikethrough: '~~',
  mark: '==',
  bold: '**',
  italic: '_',
};

const EMOJI = {
  angry:            [ '>:(', '>:-(' ],
  blush:            [ ':")', ':-")' ],
  broken_heart:     [ '</3', '<\\3' ],
  // :\ and :-\ not used because of conflict with markdown escaping
  confused:         [ ':/', ':-/' ], // twemoji shows question
  cry:              [ ':,-(', ":'-(", ":'(", ':,(' ],
  frowning:         [ ':(', ':-(' ],
  heart:            [ '<3' ],
  imp:              [ ']:(', ']:-(' ],
  innocent:         [ 'o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)' ],
  joy:              [ ":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D' ],
  kissing:          [ ':*', ':-*' ],
  laughing:         [ 'x-)', 'X-)' ],
  neutral_face:     [ ':|', ':-|' ],
  open_mouth:       [ ':o', ':-o', ':O', ':-O' ],
  rage:             [ ':@', ':-@' ],
  smile:            [ ':D', ':-D' ],
  smiley:           [ ':)', ':-)' ],
  smiling_imp:      [ ']:)', ']:-)' ],
  sob:              [ ":,'(", ":,'-(", ';(', ';-(' ],
  stuck_out_tongue: [ ':P', ':-P' ],
  sunglasses:       [ '8-)', 'B-)' ],
  sweat:            [ ',:(', ',:-(' ],
  sweat_smile:      [ ',:)', ',:-)' ],
  unamused:         [ ':s', ':-S', ':z', ':-Z', ':$', ':-$' ],
  wink:             [ ';)', ';-)' ]
};

/**
 * Rules to (de)serialize nodes.
 *
 * @type {Object}
 */

const RULES = [
  {
    serialize(obj, children) {
      if (obj.kind === 'string') {
        return children
      }
    }
  },
  {
    serialize(obj, children) {
      if (obj.kind === 'block' && NodeSerialize[obj.type]) {
        return NodeSerialize[obj.type](obj, children);
      }
    }
  },
  {
    serialize(obj, children) {
      if (obj.kind === 'inline' && InlineSerialize[obj.type]) {
        return InlineSerialize[obj.type](obj, children);
      }
    }
  },
  // Add a new rule that handles marks...
  {
    serialize(obj, children) {
      if (obj.kind === 'mark') {
        if (MARKUPS[obj.type]) {
          let markup = obj.getIn(['data', 'markup']);
          markup = markup ? markup : MARKUPS[obj.type];
          return `${markup}${children}${markup}`;
        }

        else if (obj.type === 'emoji') {
          let markup = obj.getIn(['data', 'markup']);
          if (markup) {
            if (EMOJI[markup]) {
              return EMOJI[markup][0];
            }

            return `:${markup}:`;
          }

          return children;
        }
      }
    }
  }
];

function getHeadingSuffix(obj) {
  return ``;
  // return AFTER_HEADINGS_WITHOUT_SUFFIX.has(obj.nextNodeType) ? `` : `\n`;
  // return obj.nextNodeType === 'empty' ? `\n` : ``;
}

/**
 * Rules for block nodes
 */

const NodeSerialize = {
  listLevel: 0,

  // Text
  heading1: (obj, children) => `# ${children}${getHeadingSuffix(obj)}`,
  heading2: (obj, children) => `## ${children}${getHeadingSuffix(obj)}`,
  heading3: (obj, children) => `### ${children}${getHeadingSuffix(obj)}`,
  heading4: (obj, children) => `#### ${children}${getHeadingSuffix(obj)}`,
  heading5: (obj, children) => `##### ${children}${getHeadingSuffix(obj)}`,
  heading6: (obj, children) => `###### ${children}${getHeadingSuffix(obj)}`,
  code: (obj, children) => {
    const markup = obj.getIn(['data', 'markup']);
    if (markup) {
      return `\`\`\`\n${children}\n\`\`\``;
    }

    else {
      const arrChildren = children.split('\n');
      for (let i = 0; i < arrChildren.length; i++) {
        arrChildren[i] = `    ${arrChildren[i]}`;
      }
      return `${arrChildren.join('\n')}`;
    }
  },
  paragraph: (obj, children) => {
    // If the previous node is a paragraph,
    // and the current node in blockquote
    let condition = obj.previousNodeType === 'paragraph'
                    && obj.getIn(['data', 'parent']) === 'blockquote';
    return `${condition ? '\n' : ''}${children}`;
    // return `${condition ? '\n' : ''}${children}\n`;
  },

  // Tables
  table: (obj, children) => children,
  thead: (obj, children) => {
    // th tags count ( thead -> tr -> th )
    const columnsCount = obj.nodes.get(0).nodes.size;
    return `${children}|${new Array(columnsCount).fill(' --------- |').join('')}`;
  },
  tbody: (obj, children) => `${children}`,
  // tbody: (obj, children) => `\n${children}`,
  tr: (obj, children) => {
    const parent = obj.getIn(['data', 'parent']);
    const isBody = parent === 'tbody';
    return `${isBody ? `\n` : ``}|${children}${isBody ? `` : `\n`}`;
  },
  th: (obj, children) => ` ${children} |`,
  td: (obj, children) => ` ${children} |`,

  // Lists
  'ordered-list': listNodeRule,
  'unordered-list': listNodeRule,
  'list-item': (obj, children) => {
    let parent = obj.getIn(['data', 'parent']);

    if (parent === 'unordered-list') {
      let pref;

      if (obj.getIn(['data', 'markup'])) {
        pref = obj.getIn(['data', 'markup']);
      }

      else {
        let mod = obj.getIn(['data', 'level']) % 10;
        pref = ['+', '+', '-', '-', '*', '*', '-', '+', '-', '*'][mod];
      }

      return `${pref} ${children}\n`;
    }

    else {
      return `${obj.getIn(['data', 'itemNum'])}. ${children}\n`;
    }
  },

  // Definition lists
  'dl-simple': (obj, children) => children,
  dl: (obj, children) => children,
  'dt-simple': (obj, children) => `${obj.previousNodeType === 'dd-simple' ? `\n` : ``}${children}\n`,
  dt: (obj, children) => `${children}\n`,
  'dd-simple': (obj, children) => `  ~ ${children}\n`,
  dd: (obj, children) => {
    let arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      if (arrChildren[i] !== '') {
        arrChildren[i] = i === 0 ? `:    ${arrChildren[i]}` : `     ${arrChildren[i]}`;
      }
    }
    children = arrChildren.join('\n');
    return `${children}\n`;
  },

  // Various blocks
  blockquote: (obj, children) => {
    let arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      arrChildren[i] = `> ${arrChildren[i]}`;
    }

    let level = obj.getIn(['data', 'level']);

    /**
     // This block shorten a line's prefix of the root blockquote on the next line
     //
     // Example:
     // > > >
     // > information
     //
     // change to
     //
     // >
     // > information
     */
    {
      if (level === 0) {
        let prefLength = [];
        let isEmpty = [];
        let nextLevel = [];
        let nextFullNum = [];
        for (let i = 0; i < arrChildren.length; i++) {
          prefLength[i] = arrChildren[i].match(/>/g).length;
          isEmpty[i] = !arrChildren[i].match(/[^> ]/g);

          if (!isEmpty[i]) {
            for (let j = i - 1; j >= 0 && isEmpty[j]; j--) {
              nextLevel[j] = prefLength[i];
              nextFullNum[j] = i;
            }
          }
        }

        let newArrChildren = [];
        let i = 0;
        while (i < arrChildren.length) {
          if (!isEmpty[i]) {
            newArrChildren.push(arrChildren[i]);
            i++;

            if (i < arrChildren.length && !isEmpty[i] && prefLength[i - 1] >= prefLength[i]) {
              let pref = new Array(prefLength[i]).fill('> ').join('');
              newArrChildren.push(pref);
            }
          }

          else {
            if (!nextFullNum[i]) {
              break;
            }

            if (i === 0) {
              i = nextFullNum[i];
            }

            else {
              if (prefLength[i] >= nextLevel[i]) {
                let pref = new Array(nextLevel[i]).fill('> ').join('');
                newArrChildren.push(pref);

                i = nextFullNum[i];
              }

              else {
                i++;
              }
            }
          }
        }

        arrChildren = newArrChildren;

        prefLength = [];
        isEmpty = [];
        for (let i = 0; i < arrChildren.length; i++) {
          prefLength[i] = arrChildren[i].match(/>/g).length;
          isEmpty[i] = !arrChildren[i].match(/[^> ]/g);
        }

        i = 0;
        newArrChildren = [];
        while (i < arrChildren.length) {
          if (isEmpty[i] && prefLength[i + 1]
          &&  i > 0 && prefLength[i - 1] < prefLength[i + 1]) {
            //
          }

          else {
            newArrChildren.push(arrChildren[i]);
          }

          i++;
        }

        arrChildren = newArrChildren;
      }
    }

    return `${level === 0 ? `` : `\n`}${arrChildren.join('\n')}${level === 0 ? `` : `\n`}`;
    // return `${level === 0 ? `` : `\n`}${arrChildren.join('\n')}\n`;
  },
  anchor: (obj, children) => {
    const label = obj.getIn(['data', 'label']);
    return `[^${label}]: ${children}`;
  },

  // Void blocks
  'horizontal-rule': (obj, children) => {
    const markup = obj.getIn(['data', 'markup']);
    return markup ? markup : `---`;
  },
  'abbr-def': (obj, children) => {
    const label = obj.getIn(['data', 'label']);
    const title = obj.getIn(['data', 'title']);
    return `*[${label}]: ${title}`;
    // return `*[${label}]: ${title}\n`;
  },
  empty: (obj, children) => {
    const linesCount = obj.getIn(['data', 'length']);
    return `${new Array(linesCount).fill('').join('\n')}`;
  },
};

/**
 * Rule for lists
 *
 * @param obj
 * @param {string} children
 * @returns {string}
 */

function listNodeRule(obj, children) {
  children = children.replace('\n\n', '\n'); // Delete empty strings in the list
  const listLevel = obj.getIn(['data', 'level']);
  NodeSerialize.listLevel = listLevel;

  const arrChildren = children.split('\n');

  if (listLevel > 0) {
    for (let i = 0; i < arrChildren.length; i++) {
      if (arrChildren[i] !== '') {
        arrChildren[i] = `    ${arrChildren[i]}`;
      }
    }
  }

  if (arrChildren[arrChildren.length - 1].trim() === '') {
    arrChildren.length--;
  }

  children = arrChildren.join('\n');
  children = children.replace('\n\n', '\n'); // Delete empty strings in the list
  // return `${listLevel > 0 ? `\n` : ``}${children}${listLevel > 0 ? `` : `\n`}`;
  return `${listLevel > 0 ? `\n` : ``}${children}`;
}


/**
 * Rules for inline nodes
 */

const InlineSerialize = {
  link: (obj, children) => {
    const href = obj.getIn(['data', 'href']);
    const title = obj.getIn(['data', 'title']);
    return `[${children}](${href}${title ? ` "${title}"` : ``})`;
  },
  abbr: (obj, children) => `${children}`,
  autocomplete: (obj, children) => `${children}`,

  image: obj => {
    let title = obj.getIn(['data', 'title']);
    let src = obj.getIn(['data', 'src']);
    let alt = obj.getIn(['data', 'alt']);
    return `![${title}](${src}${alt ? ` "${alt}"` : ``})`;
  },
};


/**
 * Markdown serializer.
 *
 * @type {Markdown}
 */

class Markdown {

  /**
   * Create a new serializer with `rules`.
   *
   * @param {Object} options
   *   @property {Array} rules
   * @return {Markdown} serializer
   */

  constructor(options = {}) {
    this.rules = [
      ...(options.rules || []),
      ...RULES
    ];

    this.previousNode = null;
    this.previousNodeType = '';
    this.previousNodeLevel = 0;

    this.serializeNode = this.serializeNode.bind(this);
    this.serializeRange = this.serializeRange.bind(this);
    this.serializeString = this.serializeString.bind(this);
    this.setSiblingNodesType = this.setSiblingNodesType.bind(this);
  }


  /**
   * Serialize a `state` object into an HTML string.
   *
   * @param {State} state
   * @return {String} markdown
   */

  serialize(state) {
    const {document} = state;
    document.nodes.map(this.setSiblingNodesType);
    const elements = document.nodes.map(this.serializeNode);
    return elements.join('\n').trim();
  }

  setSiblingNodesType(node) {
    if (node.kind === 'block') {
      if (this.previousNodeType) {
        node.previousNodeType = this.previousNodeType;
      }
      this.previousNodeType = node.type;
      if (this.previousNodeLevel) {
        node.previousNodeLevel = this.previousNodeLevel;
      }
      let level = node.getIn(['data', 'level']);
      if (level === 0 || level) {
        this.previousNodeLevel = level;
      }

      if (this.previousNode) {
        if (level === 0 || level) {
          this.previousNode.nextNodeLevel = level;
        }
        this.previousNode.nextNodeType = node.type;
      }

      this.previousNode = node;
    }
  }

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @return {String}
   */

  serializeNode(node) {
    if (node.kind === 'text') {
      const ranges = node.getRanges();
      return ranges.map(this.serializeRange);
    }

    node.nodes.map(this.setSiblingNodesType);
    let children = node.nodes.map(this.serializeNode);
    children = children.flatten().length === 0 ? '' : children.flatten().join('');

    for (const rule of this.rules) {
      if (!rule.serialize) continue;
      let ret = rule.serialize(node, children);

      if (ret) {
        ret = ret.replace(/_\*\*_/g, '**');
        ret = ret.replace(/\*\*__/g, '**');
        ret = ret.replace(/__\*\*/g, '**');

        return ret;
      }
    }
  }

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @return {String}
   */

  serializeRange(range) {
    const string = new String({text: range.text});
    const text = this.serializeString(string);

    return range.marks.reduce((children, mark) => {
      for (const rule of this.rules) {
        if (!rule.serialize) continue;
        const ret = rule.serialize(mark, children);

        if (ret) return ret
      }
    }, text);
  }

  /**
   * Serialize a `string`.
   *
   * @param {String} string
   * @return {String}
   */

  serializeString(string) {
    let strVal = string.text;

    if (strVal.replace) {
      strVal = strVal.replace(
        /^((#+|(> *)+| +\+| +-| +\*| +[0-9]\.| +[0-9]\)| +[a-z]\.| +[a-z]\)| +[A-Z]\.| +[A-Z]\))( |$))/,
        '\\$1'
      );
      strVal = strVal.replace(/(\+\+|\+|--|-|\*\*|\*|`|~~|~|\^)(.+)\1/g, '\\$1$2\\$1');

      strVal = strVal.replace(/©/g, '(C)');
      strVal = strVal.replace(/®/g, '(R)');
      strVal = strVal.replace(/™/g, '(TM)');
      strVal = strVal.replace(/§/g, '(P)');
      strVal = strVal.replace(/±/g, '+-');
      strVal = strVal.replace(/–/g, '--');
      strVal = strVal.replace(/—/g, '---');
      strVal = strVal.replace(/…/g, '...');
    }

    for (const rule of this.rules) {
      if (!rule.serialize) continue;
      const ret = rule.serialize(string, strVal);
      if (ret) return ret;
    }
  }

  trimStr(str) {
    const arrStr = str.split('\n');
    for (let i = 0; i < arrStr.length; i++) {
      arrStr[i] = arrStr[i].trimRight();
    }

    return arrStr.join('\n');
  }

  /**
   * Deserialize a markdown `string`.
   *
   * @param {String} markdown
   * @param {Array} options
   *    example:
   *    options = [{ regex: '\\$(\\w+)', id: 'term'}, { regex: '\\#(\\w+)', id: 'product'}]
   *    markdown = #code
   *            ->
   *    {
   *      "kind": "inline",
   *      "isVoid": false,
   *      "nodes": [{"kind": "text", "ranges": [{"text": "#code"}]}],
   *      "type": "autocomplete",
   *      "data": {"id": "product"}
   *    }
   *
   * @return {State} state
   *
   */
  deserialize(markdown, options=[]) {
    options = [{ regex: '\\$(\\w+)', id: 'term'}, { regex: '\\#(\\w+)', id: 'product'}];

    const nodes = MarkdownParser.parse(markdown, options);
    const state = Raw.deserialize(nodes, {terse: true});
    return state;
  }
}

/**
 * Export.
 */

export default Markdown
