import { Record } from 'immutable'
import Utils from './utils'


function createArrayJoined(length, value, sep = '') {
  const arrFill = [];
  for (let i = 0; i < length; i++) {
    arrFill.push(value);
  }

  return arrFill.join(sep);
}

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
  italic: '_',
};

const EMOJI = {
  angry: ['>:(', '>:-('],
  blush: [':")', ':-")'],
  broken_heart: ['</3', '<\\3'],
  // :\ and :-\ not used because of conflict with markdown escaping
  confused: [':/', ':-/'], // twemoji shows question
  cry: [':,-(', ":'-(", ":'(", ':,('],
  frowning: [':(', ':-('],
  heart: ['<3'],
  imp: [']:(', ']:-('],
  innocent: ['o:)', 'O:)', 'o:-)', 'O:-)', '0:)', '0:-)'],
  joy: [":')", ":'-)", ':,)', ':,-)', ":'D", ":'-D", ':,D', ':,-D'],
  kissing: [':*', ':-*'],
  laughing: ['x-)', 'X-)'],
  neutral_face: [':|', ':-|'],
  open_mouth: [':o', ':-o', ':O', ':-O'],
  rage: [':@', ':-@'],
  smile: [':D', ':-D'],
  smiley: [':)', ':-)'],
  smiling_imp: [']:)', ']:-)'],
  sob: [":,'(", ":,'-(", ';(', ';-('],
  stuck_out_tongue: [':P', ':-P'],
  sunglasses: ['8-)', 'B-)'],
  sweat: [',:(', ',:-('],
  sweat_smile: [',:)', ',:-)'],
  unamused: [':s', ':-S', ':z', ':-Z', ':$', ':-$'],
  wink: [';)', ';-)']
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

      return undefined;
    }
  },
  {
    serialize(obj, children, previousNodeType) {
      if (obj.kind === 'block' && NodeSerialize[obj.type]) { // eslint-disable-line
        return NodeSerialize[obj.type](obj, children, previousNodeType);
      }

      return undefined;
    }
  },
  {
    serialize(obj, children) {
      if (obj.kind === 'inline' && InlineSerialize[obj.type]) { // eslint-disable-line
        return InlineSerialize[obj.type](obj, children);
      }

      return undefined;
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
        } else if (obj.type === 'emoji') {
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

      return undefined;
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
  code: (obj, children) => {
    const markup = obj.getIn(['data', 'markup']);
    if (markup) {
      return `\`\`\`\n${children}\n\`\`\``;
    } else {
      const arrChildren = children.split('\n');
      for (let i = 0; i < arrChildren.length; i++) {
        arrChildren[i] = `    ${arrChildren[i]}`;
      }
      return `${arrChildren.join('\n')}`;
    }
  },
  paragraph: (obj, children, previousNodeType) => {
    // If the previous node is a paragraph,
    // and the current node in blockquote
    let condition = previousNodeType === 'paragraph' && obj.getIn(['data', 'parent']) === 'blockquote';
    return `${condition ? '\n\n' : ''}${children}`;
  },

  // Tables
  table: (obj, children) => children,
  thead: (obj, children) => {
    // th tags count ( thead -> tr -> th )
    const columnsCount = obj.nodes.get(0).nodes.size;
    return `${children}|${createArrayJoined(columnsCount, ' --------- |')}`;
  },
  tbody: (obj, children) => `${children}`,
  tr: (obj, children) => {
    const parent = obj.getIn(['data', 'parent']);
    const isBody = parent === 'tbody';
    return `${isBody ? `\n` : ``}|${children}${isBody ? `` : `\n`}`;
  },
  th: (obj, children) => ` ${children} |`,
  td: (obj, children) => ` ${children} |`,

  // Lists
  'ordered-list': listNodeRule, // eslint-disable-line
  'unordered-list': listNodeRule, // eslint-disable-line
  'list-item': (obj, children) => {
    let parent = obj.getIn(['data', 'parent']);

    if (parent === 'unordered-list') {
      let pref;

      if (obj.getIn(['data', 'markup'])) {
        pref = obj.getIn(['data', 'markup']);
      } else {
        let mod = obj.getIn(['data', 'level']) % 10;
        pref = ['+', '+', '-', '-', '*', '*', '-', '+', '-', '*'][mod];
      }

      return `${pref} ${children}\n`;
    } else {
      return `${obj.getIn(['data', 'itemNum'])}. ${children}\n`;
    }
  },

  // Definition lists
  'dl-simple': (obj, children) => children,
  dl: (obj, children) => children,
  'dt-simple': (obj, children, previousNodeType) => `${previousNodeType === 'dd-simple' ? `\n` : ``}${children}\n`,
  dt: (obj, children) => `${children}\n`,
  'dd-simple': (obj, children) => `  ~ ${children}\n`,
  dd: (obj, children) => {
    let arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      if (arrChildren[i] !== '') {
        arrChildren[i] = i === 0 ? `:    ${arrChildren[i]}` : `     ${arrChildren[i]}`;
      }
    }
    children = arrChildren.join('\n'); // eslint-disable-line
    return `${children}\n`;
  },

  // Various blocks
  blockquote: (obj, children) => {
    let arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      arrChildren[i] = `> ${arrChildren[i]}`;
    }

    let level = obj.getIn(['data', 'level']); // Level this blockquote

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
    if (level === 1) {
      let prefLength = []; // Level this line (prefix length)
      let isEmpty = []; // This line is empty or not
      let nextLevel = []; // Levels next not empty line
      let nextFullNum = []; // Numbers next not empty line
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
            let pref = createArrayJoined(prefLength[i], '> ');
            newArrChildren.push(pref);
          }
        } else {
          if (!nextFullNum[i]) {
            break;
          }

          if (i === 0) {
            i = nextFullNum[i];
          } else {
            if (prefLength[i] >= nextLevel[i]) {
              let pref = createArrayJoined(nextLevel[i], '> ');
              newArrChildren.push(pref);

              i = nextFullNum[i];
            } else {
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
        if (isEmpty[i] && prefLength[i + 1] &&
          i > 0 && prefLength[i - 1] < prefLength[i + 1]) {
          //
        } else {
          newArrChildren.push(arrChildren[i]);
        }

        i++;
      }

      arrChildren = newArrChildren;
    }

    return `${level === 1 ? `` : `\n`}${arrChildren.join('\n')}${level === 1 ? `` : `\n`}`;
  },
  anchor: (obj, children) => {
    const label = obj.getIn(['data', 'label']);
    return `[^${label}]: ${children}`;
  },

  // Void blocks
  'horizontal-rule': obj => {
    const markup = obj.getIn(['data', 'markup']);
    return markup ? markup : `---`;
  },
  'abbr-def': obj => {
    const label = obj.getIn(['data', 'label']);
    const title = obj.getIn(['data', 'title']);
    return `*[${label}]: ${title}`;
  },
  empty: () => {
    return ``;
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
  // Delete empty strings in the list
  children = children.replace('\n\n', '\n'); // eslint-disable-line
  const listLevel = obj.getIn(['data', 'level']);
  NodeSerialize.listLevel = listLevel;

  const arrChildren = children.split('\n');

  if (listLevel > 1) {
    for (let i = 0; i < arrChildren.length; i++) {
      if (arrChildren[i] !== '') {
        arrChildren[i] = `    ${arrChildren[i]}`;
      }
    }
  }

  if (arrChildren[arrChildren.length - 1].trim() === '') {
    arrChildren.length--;
  }

  children = arrChildren.join('\n'); // eslint-disable-line
  // Delete empty strings in the list
  children = children.replace('\n\n', '\n'); // eslint-disable-line
  return `${listLevel > 1 ? `\n` : ``}${children}`;
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

  softbreak: () => `\n`,
};


/**
 * Markdown serializer.
 *
 * @type {RichMarkdownSerializer}
 */

class RichMarkdownSerializer {

  /**
   * Create a new serializer with `rules`.
   *
   * @param {Object} options
   *   @property {Array} rules
   * @return {RichMarkdownSerializer} serializer
   */

  constructor() {
    this.previousNodeType = '';

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
    const { document } = state;
    const elements = [];
    for (let node of document.nodes) {
      elements.push(this.serializeNode(node));
    }

    return elements.join('\n').trim();
  }

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @return {String|undefined}
   */

  serializeNode(node) {
    if (node.kind === 'text') {
      const ranges = node.getRanges();
      return ranges.map(this.serializeRange);
    }

    let children = [];
    for (let childNode of node.nodes) {
      children.push(this.serializeNode(childNode));
    }

    let childrenFlatten = Utils.flatten(children);
    children = childrenFlatten.length === 0 ? '' : childrenFlatten.join('');

    let ret = null;

    for (const rule of RULES) {
      if (!rule.serialize) {
        continue;
      }
      ret = rule.serialize(node, children);

      if (node.kind === 'block') {
        ret = rule.serialize(node, children, this.previousNodeType);
      } else {
        ret = rule.serialize(node, children);
      }

      if (ret) {
        break;
      }
    }

    if (node.kind === 'block') {
      this.previousNodeType = node.type;
    }

    if (ret) {
      ret = ret.replace(/_\*\*_/g, '**');
      ret = ret.replace(/\*\*__/g, '**');
      ret = ret.replace(/__\*\*/g, '**');

      return ret;
    }

    return undefined;
  }

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @return {String|undefined}
   */

  serializeRange(range) {
    const string = new String({ text: range.text }); // eslint-disable-line
    const text = this.serializeString(string);

    return range.marks.reduce((children, mark) => {
      for (const rule of RULES) {
        if (!rule.serialize) {
          continue;
        }
        const ret = rule.serialize(mark, children);

        if (ret) {
          return ret
        }
      }

      return undefined;
    }, text);
  }

  /**
   * Serialize a `string`.
   *
   * @param {String} string
   * @return {String|undefined}
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

    for (const rule of RULES) {
      if (!rule.serialize) {
        continue;
      }
      const ret = rule.serialize(string, strVal);
      if (ret) {
        return ret;
      }
    }

    return undefined;
  }
}

/**
 * Export.
 */

export default RichMarkdownSerializer
