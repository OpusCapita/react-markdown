import { Record } from 'immutable'
import Utils from './utils'
import { flattenDeep } from 'lodash'


/**
 * String.
 */

const StringRecord = new Record({
  kind: 'string',
  text: ''
});

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
        let markup = obj.getIn(['data', 'markup']);
        return `${markup}${children}${markup}`;
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
    return `${children}|${Utils.createArrayJoined(columnsCount, ' --------- |')}`;
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
      let pref = obj.getIn(['data', 'markup']);
      return `${pref} ${children}\n`;
    } else {
      return `${obj.getIn(['data', 'itemNum'])}. ${children}\n`;
    }
  },

  // Definition lists
  'dl-simple': (obj, children) => children,
  'dt-simple': (obj, children, previousNodeType) => {
    return `${previousNodeType === 'dd-simple' ? `\n` : ``}${children}\n`;
  },
  'dd-simple': (obj, children) => `  ~ ${children}\n`,

  // This code will use un future
  // dl: (obj, children) => children,
  // 'dt': (obj, children, previousNodeType) => `${previousNodeType === 'dd' ? `\n` : ``}${children}\n`,
  // dd: (obj, children) => {
  //   let arrChildren = children.split('\n');
  //   for (let i = 0; i < arrChildren.length; i++) {
  //     if (arrChildren[i] !== '') {
  //       arrChildren[i] = i === 0 ? `:    ${arrChildren[i]}` : `     ${arrChildren[i]}`;
  //     }
  //   }
  //   children = arrChildren.join('\n'); // eslint-disable-line
  //   return `${children}\n`;
  // },

  // Various blocks
  blockquote: (obj, children) => {
    let arrChildren = children.split('\n');
    for (let i = 0; i < arrChildren.length; i++) {
      arrChildren[i] = `> ${arrChildren[i]}`;
    }

    let level = obj.getIn(['data', 'level']); // Level this blockquote

    if (level === 1) {
      arrChildren = addEmptyLinesToBlockquote(arrChildren);
      arrChildren = removeEmptyLinesFromBlockquote(arrChildren);
    }

    return `${level === 1 ? `` : `\n`}${arrChildren.join('\n')}${level === 1 ? `` : `\n`}`;
  },
  anchor: (obj, children) => {
    const label = obj.getIn(['data', 'label']);
    return `[^${label}]: ${children}`;
  },

  // Void blocks
  'horizontal-rule': obj => {
    // const markup = obj.getIn(['data', 'markup']);
    return obj.getIn(['data', 'markup']);
  },
  'abbr-def': obj => {
    const label = obj.getIn(['data', 'label']);
    const title = obj.getIn(['data', 'title']);
    return `*[${label}]: ${title}`;
  },
};

/**
 * createPrefixLine
 *
 * @param {Number} num
 * @returns {String} prefix line, example `> > > `
 */

function createPrefixLine(num) {
  return Utils.createArrayJoined(num, '> ');
}

/**
 * addEmptyLinesToBlockquote
 *
 * @param {Array} arrChildren
 * @returns {Array}
 */

function addEmptyLinesToBlockquote(arrChildren) {
  const prefLength = []; // Level this line (prefix length)
  const isEmpty = []; // This line is empty or not
  const nextLevel = []; // Levels next not empty line
  const nextFullNum = []; // Numbers next not empty line
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
        let prefixLine = createPrefixLine(prefLength[i]);
        newArrChildren.push(prefixLine);
      }
    } else {
      if (!nextFullNum[i]) {
        break;
      }

      let prefixLine = createPrefixLine(nextLevel[i]);
      newArrChildren.push(prefixLine);

      i = nextFullNum[i];
    }
  }

  return newArrChildren;
}

/**
 * removeEmptyLinesFromBlockquote
 *
 * @param {Array} arrChildren
 * @returns {Array}
 */

function removeEmptyLinesFromBlockquote(arrChildren) {
  const prefLength = [];
  const isEmpty = [];
  for (let i = 0; i < arrChildren.length; i++) {
    prefLength[i] = arrChildren[i].match(/>/g).length;
    isEmpty[i] = !arrChildren[i].match(/[^> ]/g);
  }

  let i = 0;
  let newArrChildren = [];
  while (i < arrChildren.length) {
    if (isEmpty[i] && prefLength[i + 1] &&
      i > 0 && prefLength[i - 1] < prefLength[i + 1]) {
      //
    } else {
      newArrChildren.push(arrChildren[i]);
    }

    i++;
  }

  return newArrChildren;
}

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

  arrChildren.length--;

  children = arrChildren.join('\n'); // eslint-disable-line
  // Delete empty strings in the list
  children = children.replace('\n\n', '\n'); // eslint-disable-line
  return `${listLevel > 1 ? `\n` : ``}${children}`;
}


/**
 * Rules for inline nodes
 */

const InlineSerialize = {
  // ~~_**[link text](http://dev.nodeca.com)**_~~
  // _**[link text](http://dev.nodeca.com)**_
  // _[link text](http://dev.nodeca.com)_
  // **[link text](http://dev.nodeca.com)**
  // [link text](http://dev.nodeca.com)
  link: (obj, children) => {
    const href = obj.getIn(['data', 'href']);
    const title = obj.getIn(['data', 'title']);
    let string = `[${children}](${href}${title ? ` "${title}"` : ``})`;
    // This RegExp moved markups from brackets to link begin and link end
    // [~~_**link text**_~~](http://dev.nodeca.com)  changed to  ~~_**[link text](http://dev.nodeca.com)**_~~
    string = string.replace(
      /\[(\+\+|\+|\*\*|\*|__|_|~~|~|\^)?(\+\+|\+|\*\*|\*|__|_|~~|~|\^)?(\+\+|\+|\*\*|\*|__|_|~~|~|\^)?(.+)\3\2\1](.+)/,
      '$1$2$3[$4]$5$3$2$1'
    );
    return string;
  },
  abbr: (obj, children) => `${children}`,
  // autocomplete: (obj, children) => `${children}`, // This code will use in future

  image: obj => {
    let title = obj.getIn(['data', 'title']);
    let src = obj.getIn(['data', 'src']);
    let alt = obj.getIn(['data', 'alt']);
    return `![${title}](${src}${alt ? ` "${alt}"` : ``})`;
  },
};


const RichMarkdownSerializer = {
  /**
   * Serialize a `string`.
   *
   * @param {StringRecord} string
   * @return {String|undefined}
   */

  serializeString(string) { // eslint-disable-line
    let strVal = string.text;

    strVal = strVal.replace(
      /^((#+|(> *)+| +\+| +-| +\*| +[0-9]\.| +[0-9]\)| +[a-z]\.| +[a-z]\)| +[A-Z]\.| +[A-Z]\))( |$))/,
      '\\$1'
    );
    strVal = strVal.replace(/(\+\+|\+|--|-|\*\*|\*|`|~~|~|\^)(.+)\1/g, '\\$1$2\\$1');

    for (let i = 0; i < RULES.length; i++) {
      const rule = RULES[i];
      const ret = rule.serialize(string, strVal);
      if (ret) {
        return ret;
      }
    }
  },

  /**
   * Serialize a `mark`.
   *
   * @param children
   * @param mark
   * @returns {String|undefined}
   */

  serializeMark(children, mark) { // eslint-disable-line
    for (let i = 0; i < RULES.length; i++) {
      const rule = RULES[i];
      const ret = rule.serialize(mark, children);

      if (ret) {
        return ret
      }
    }
  },

  /**
   * Serialize a `range`.
   *
   * @param {Range} range
   * @return {String|undefined}
   */

  serializeRange(range) {
    const string = new StringRecord({ text: range.text });
    const text = this.serializeString(string);
    return range.marks.reduce(this.serializeMark, text);
  },

  /**
   * Serialize a `node`.
   *
   * @param {Node} node
   * @param {String} parentPreviousNodeType
   * @return {String|Array|undefined}
   */

  serializeNode(node, parentPreviousNodeType = '') {
    let previousNodeType = parentPreviousNodeType;
    if (node.kind === 'text') {
      const ranges = [];
      node.getRanges().forEach(range => {
        let str = this.serializeRange(range);
        ranges.push(str);
      });
      return ranges;
    }

    // Serialize and join child nodes
    let children = [];
    node.nodes.forEach(childNode => {
      children.push(this.serializeNode(childNode, previousNodeType));
      if (node.kind === 'block' && childNode.type) {
        previousNodeType = childNode.type;
      }
    });

    let childrenFlatten = flattenDeep(children);
    children = childrenFlatten.join('');
    // children = childrenFlatten.length === 0 ? '' : childrenFlatten.join('');

    // processing of the current node
    let ret = null;
    for (let i = 0; i < RULES.length; i++) {
      const rule = RULES[i];
      if (node.kind === 'block') {
        ret = rule.serialize(node, children, previousNodeType);
      } else {
        ret = rule.serialize(node, children);
      }

      if (ret) {
        // Remove empty textNode with marker _ (italic)
        ret = ret.replace(/_\*\*_/g, '**');
        ret = ret.replace(/\*\*__/g, '**');
        ret = ret.replace(/__\*\*/g, '**');

        return ret;
      }
    }

    return undefined;
  },

  /**
   * Serialize a `state` object into an HTML string.
   *
   * @param {State} state
   * @return {String} markdown
   */

  serialize(state) {
    const { document } = state;
    const elements = [];
    document.nodes.forEach(node => {
      elements.push(this.serializeNode(node));
    });
    const markdown = elements.join('\n').trim();

    // This console.log is necessary for debugging
    // console.log('markdown:');
    // console.log(markdown);
    // console.log(' ');
    // console.log(' ');

    return markdown;
  },
};

function serialize(state) {
  return RichMarkdownSerializer.serialize(state);
}

/**
 * Export.
 */

export default serialize
