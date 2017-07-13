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

const MARKUPS = {
  code: '`',
  underline: '++',
  sup: '^',
  sub: '~',
  strikethrough: '~~',
  mark: '==',
  bold: '**',
  italic: '*',
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
      if (obj.kind === 'mark' && MARKUPS[obj.type]) {
        let markup = obj.getIn(['data', 'markup']);
        markup = markup ? markup : MARKUPS[obj.type];
        return `${markup}${children}${markup}`;
      }
    }
  }
];


/**
 * Rules for block nodes
 */

const NodeSerialize = {
  listLevel: 0,

  // Text
  heading1: (obj, children) => `# ${children}`,
  heading2: (obj, children) => `## ${children}`,
  heading3: (obj, children) => `### ${children}`,
  heading4: (obj, children) => `#### ${children}`,
  heading5: (obj, children) => `##### ${children}`,
  heading6: (obj, children) => `###### ${children}`,
  paragraph: (obj, children) => `${children}\n`,
  code: (obj, children) => `\`\`\`\n${children}\n\`\`\`\n`,

  // Tables
  table: (obj, children) => children,
  thead: (obj, children) => {
    // th tags count ( thead -> tr -> th )
    const columnsCount = obj.nodes.get(0).nodes.size;
    return `${children}|${new Array(columnsCount).fill(' --------- |').join('')}`;
  },
  tbody: (obj, children) => `\n${children}`,
  tr: (obj, children) => `| ${children}\n`,
  th: (obj, children) => `${children} |`,
  td: (obj, children) => `${children} |`,

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
    const arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      arrChildren[i] = `> ${arrChildren[i]}`;
    }
    return `\n${arrChildren.join('\n')}`;
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
    return `*[${label}]: ${title}\n`;
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
  NodeSerialize.listLevel = obj.getIn(['data', 'level']);

  const arrChildren = children.split('\n');

  if (NodeSerialize.listLevel > 0) {
    for (let i = 0; i < arrChildren.length; i++) {
      if (arrChildren[i] !== '') {
        arrChildren[i] = `    ${arrChildren[i]}`;
      }
    }
  }

  children = arrChildren.join('\n');
  children = children.replace('\n\n', '\n'); // Delete empty strings in the list
  return `${NodeSerialize.listLevel > 0 ? `\n` : ``}${children}`;
}


/**
 * Rules for inline nodes
 */

const InlineSerialize = {
  link: (obj, children) => `[${children}](${obj.getIn(['data', 'href'])})`,
  abbr: (obj, children) => `${children}`,

  image: obj => {
    let title = obj.getIn(['data', 'title']);
    let src = obj.getIn(['data', 'src']);
    let alt = obj.getIn(['data', 'alt']);
    return `![${title}](${src} "${alt}")`;
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

    this.previousNodeType = '';

    this.serializeNode = this.serializeNode.bind(this);
    this.serializeRange = this.serializeRange.bind(this);
    this.serializeString = this.serializeString.bind(this);
  }


  /**
   * Serialize a `state` object into an HTML string.
   *
   * @param {State} state
   * @return {String} markdown
   */

  serialize(state) {
    const {document} = state;
    const elements = document.nodes.map(this.serializeNode);
    return elements.join('\n').trim();
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

    if (node.kind === 'block') {
      if (this.previousNodeType) {
        node.previousNodeType = this.previousNodeType;
      }
      this.previousNodeType = node.type;
    }

    let children = node.nodes.map(this.serializeNode);
    children = children.flatten().length === 0 ? '' : children.flatten().join('');

    for (const rule of this.rules) {
      if (!rule.serialize) continue;
      let ret = rule.serialize(node, children);

      if (ret) {
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

  /**
   * Deserialize a markdown `string`.
   *
   * @param {String} markdown
   * @return {State} state
   */
  deserialize(markdown) {
    const nodes = MarkdownParser.parse(markdown);
    const state = Raw.deserialize(nodes, {terse: true});
    return state;
  }
}

/**
 * Export.
 */

export default Markdown
