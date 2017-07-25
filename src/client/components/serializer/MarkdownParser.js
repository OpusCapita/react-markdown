import MarkdownIt from 'markdown-it';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItAbbr from './plugins/markdown-it-abbr';

// import MarkdownItEmoji from 'markdown-it-emoji';
// import MarkdownItDeflist from 'markdown-it-deflist';
// import MarkdownItAnchor from './plugins/markdown-it-anchor';
// import MarkdownItEmptyLine from './plugins/markdown-it-emptyline';
// import MarkdownItParagraph from './plugins/markdown-it-paragraph';
import MarkdownAutocomplete from './plugins/markdown-it-autocomplete';

import Utils from './Utils';
import Nodes from './ChildrenParser';
const { ChildrenParser, TextNode, TextBlock } = Nodes;

const types = {
  'h1': 'heading1',
  'h2': 'heading2',
  'h3': 'heading3',
  'h4': 'heading4',
  'h5': 'heading5',
  'h6': 'heading6',
  'p': 'paragraph',
  'blockquote': 'blockquote',
  'li': 'list-item',
  'ul': 'unordered-list',
  'ol': 'ordered-list',
  'hr': 'horizontal-rule',
  'table': 'table',
  'thead': 'thead',
  'tr': 'tr',
  'th': 'th',
  'tbody': 'tbody',
  'td': 'td',
  'code': 'code',
  'dd': 'dd',
  'dt': 'dt',
  'dl': 'dl',
  'anchor': 'anchor',
  'empty': 'empty',
  'abbr-def': 'abbr-def',
};

const LISTS_BLOCKQUOTES = new Set(['ordered-list', 'unordered-list', 'blockquote']);
const TABLES = new Set(['table', 'thead', 'tbody']);


class BlockNode {
  constructor(token) {
    this.kind = "block";
    this.type = !(token.tag in types) ? 'default' : types[token.tag];
    this.nodes = [];
    this.tag = token.tag;
    this.data = {};

    if ((token.type === 'list_item_open' || token.type === 'hr' || token.type === 'fence')
      &&  token.markup) {
      this.data.markup = token.markup;
    }

    if (token.tag === 'hr' || token.tag === 'abbr-def') {
      this.isVoid = true;
    }

    if (token.level === 0 || token.level) {
      this.data.level = token.level;
    }

    if (token.attrs) {
      this.attrs = Utils.parseAttrs(token.attrs);

      if (this.attrs.style) {
        this.style = this.attrs.style;
      }
    }

    if (token.meta) {
      this.data = Utils.assign(this.data, token.meta);
    }
  }
}

const MarkdownParser = {
  stack: [],
  level: 0,
  currentBlock: null,
  blocks: [],
  parentBlock: null,

  init() {
    this.stack = [];
    this.level = 0;
    this.currentBlock = null;
    this.blocks = [];
    this.parentBlock = null;
  },

  preprocessing(tokens) {
    let i = 0;
    let blockquoteLevel = 0;
    let bulletListLevel = 0;
    let orderedListLevel = 0;
    let ddLevel = 0;
    let anchorLevel = 0;

    while (i + 1 < tokens.length) {
      let token = tokens[i];

      if (token.type === 'empty' && token.level > 0) {
        tokens.splice(i, 1);
      }

      else if ((blockquoteLevel > 0 || bulletListLevel > 0
          || orderedListLevel > 0 || ddLevel > 0 || anchorLevel > 0)
        && (token.type === 'paragraph_open' || token.type === 'paragraph_close')) {
        tokens.splice(i, 1);
      }

      else if (bulletListLevel > 1
        && token.type === 'bullet_list_close' && tokens[i + 1].type === 'bullet_list_open') {
        tokens.splice(i, 2);
      }

      else {
        if (token.type === 'blockquote_open') {
          blockquoteLevel++;
        }

        else if (token.type === 'blockquote_close') {
          blockquoteLevel--;
        }

        else if (token.type === 'bullet_list_open') {
          bulletListLevel++;
        }

        else if (token.type === 'bullet_list_close') {
          bulletListLevel--;
        }

        else if (token.type === 'ordered_list_open') {
          orderedListLevel++;
        }

        else if (token.type === 'ordered_list_close') {
          orderedListLevel--;
        }

        else if (token.type === 'dd_open') {
          ddLevel++;
        }

        else if (token.type === 'dd_close') {
          ddLevel--;
        }

        else if (token.type === 'anchor_open') {
          anchorLevel++;
        }

        else if (token.type === 'anchor_close') {
          anchorLevel--;
        }

        else if (token.type === 'code_block' || token.type === 'fence') {
          token.content = token.content.replace(/\n$/, '');
        }

        i++;
      }
    }
  },

  childrenHandler(token, parentType) {
    let parent = token.type;
    let num = token.type === 'ordered-list' && token.attrs && token.attrs.start ? token.attrs.start : 1;

    for (let item of token.nodes) {
      if (!item.data) {
        item.data = {};
      }

      if (LISTS_BLOCKQUOTES.has(parent)) {
        item.data.parent = parent;
      }

      else if (parentType === 'blockquote') {
        item.data.parent = parentType;
      }

      if (token.type === 'ordered-list') {
        item.data.itemNum = num++;
      }

      if (item.nodes) {
        this.postprocessing(item.nodes, item.data.parent);
      }
    }

    return parent;
  },

  setRecursiveParent(nodes, parent) {
    for (let item of nodes) {
      if (!item.data) {
        item.data = {};
      }

      item.data.parent = parent;

      if (item.nodes) {
        if (TABLES.has(item.type)) {
          this.setRecursiveParent(item.nodes, item.type);
        }

        else {
          this.setRecursiveParent(item.nodes, parent);
        }
      }
    }
  },

  postprocessing(tokens) {
    for (let token of tokens) {
      let parent = '';

      switch (token.type) {
        case 'table':
        case 'thead':
        case 'tbody':
          parent = token.type;
          this.setRecursiveParent(token.nodes, parent);
          break;

        case 'ordered-list':
        case 'unordered-list':
        case 'blockquote':
          parent = token.type;
          let num = token.type === 'ordered-list' && token.attrs && token.attrs.start ? token.attrs.start : 1;

          this.setRecursiveParent(token.nodes, parent);

          for (let item of token.nodes) {
            if (!item.data) {
              item.data = {};
            }

            if (token.type === 'ordered-list') {
              item.data.itemNum = num++;
            }

            if (item.nodes) {
              this.postprocessing(item.nodes);
            }
          }

          break;

        case 'dl':
          let isSimple = true;

          for (let item of token.nodes) {
            if (item.type === 'dd' && item.nodes.length > 1) {
              isSimple = false;
              break;
            }
          }

          if (isSimple) {
            token.type = 'dl-simple';

            for (let item of token.nodes) {
              switch (item.type) {
                case 'dt':
                  item.type = 'dt-simple';
                  break;
                case 'dd':
                  item.type = 'dd-simple';
                  item.nodes = item.nodes[0].nodes; // remove p-wrapper

                  break;
              }
            }
          }
          break;
      }
    }
  },

  saveCurrentBlock() {
    if (this.currentBlock) {
      if (this.parentBlock) {
        this.parentBlock.nodes.push(this.currentBlock);
      }

      else {
        this.blocks.push(this.currentBlock);
      }

      this.currentBlock = null;
    }
  },

  moveParentBlockToCurrent() {
    if (this.parentBlock) {
      this.currentBlock = this.parentBlock;
      this.parentBlock = null;
    }

    if (this.stack.length > 0) {
      this.parentBlock = this.stack.pop();
    }
  },

  createBlock(token) {
    if (this.currentBlock) {
      if (this.parentBlock) {
        this.stack.push(this.parentBlock);
      }

      this.parentBlock = this.currentBlock;
    }

    this.currentBlock = new BlockNode(token);
    this.level++;
  },

  addInlineToBlock(token) {
    let node = new BlockNode(token);

    if (token.children) {
      node.nodes = new ChildrenParser(token.children).nodes;
    }

    this.currentBlock.nodes.push(node);
  },

  addInlineText(token) {
    if (token.children) {
      this.currentBlock.nodes = new ChildrenParser(token.children).nodes;
    }
  },

  closeBlock() {
    this.level--;
    this.saveCurrentBlock();
    this.moveParentBlockToCurrent();
  },

  addCodeBlock(token) {
    let blockNode = new BlockNode(token);
    let textNode = new TextNode();
    let textBlock = new TextBlock({});
    textBlock.setText(token.content);
    textNode.addTextBlock(textBlock);
    blockNode.nodes.push(textNode);

    if (this.level === 0) {
      this.currentBlock = blockNode;
      this.saveCurrentBlock();
    }

    else {
      this.currentBlock.nodes.push(blockNode);
    }
  },

  addHRBlock(token) {
    this.currentBlock = new BlockNode(token);
    this.saveCurrentBlock();
  },

  getDefaultFragment() {
    return [{
      kind: "block",
      type: "paragraph",
      nodes: [
        {
          kind: "text",
          ranges: [
            {
              text: ""
            }
          ]
        }
      ]
    }];
  },

  processing(tokens) {
    let previousType = '';
    for (let token of tokens) {
      if (token.type) {
        const lastElem = Utils.getLastElemTokenType(token);

        if (lastElem === 'open') {
          this.createBlock(token);
        }

        else if (token.type === 'inline' && previousType !== 'empty') {
          if (this.currentBlock.type === 'dd' || this.currentBlock.type === 'blockquote') {
            token.tag = 'p';
            this.addInlineToBlock(token);
          }

          else {
            this.addInlineText(token);
          }
        }

        else if (lastElem === 'close') {
          this.closeBlock();
        }

        else if (token.tag === 'code') {
          this.addCodeBlock(token);
        }

        else if (token.type === 'hr' || token.type === 'empty' || token.type === 'abbr-def') {
          this.addHRBlock(token);
        }
      }

      previousType = token.type;
    }
  },

  eventParse(eventTokens) {
    this.preprocessing(eventTokens);
    this.processing(eventTokens);
    this.postprocessing(this.blocks);

    // This console.log is necessary for debugging
    // console.log('markdown it:\n', JSON.stringify(eventTokens));
    // console.log(' ');
    // console.log(' ');
    // console.log('StateRender:');
    // console.log(JSON.stringify(this.blocks));
    // console.log(' ');
    // console.log(' ');

    return this.blocks;
  },

  render(markdownData, options = []) {
    this.init();

    const markdown = new MarkdownIt({
      linkify: true,
      typographer: true,
      breaks: true
    });

    markdown
      .use(MarkdownItSub)
      .use(MarkdownItSup)
      .use(MarkdownItIns)
      .use(MarkdownItMark)
      .use(MarkdownItAbbr)
    // .use(MarkdownItEmoji)
    // .use(MarkdownItDeflist)
    // .use(MarkdownItAnchor)
    // .use(MarkdownItEmptyLine)
    // .use(MarkdownItParagraph)
    ;

    const markdownAutocomplete = new MarkdownAutocomplete(options);
    markdown.use(markdownAutocomplete);
    let eventTokens = markdown.parse(markdownData || '', {});
    return this.eventParse(eventTokens);
  },

  parse(markdownData, options = []) {
    let fragment = null;

    if (markdownData === '') {
      fragment = this.getDefaultFragment();
    }

    else {
      try {
        fragment = this.render(markdownData, options);
      }

      catch (e) {
        fragment = this.getDefaultFragment();
      }
    }

    return {nodes: fragment};
  },
};

export default MarkdownParser;
