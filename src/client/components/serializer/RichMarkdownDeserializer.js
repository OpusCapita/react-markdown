import MarkdownIt from '../../markdown-it';
import { Raw } from 'slate'

import utils from './utils';
import { ChildrenParser, TextNode, TextBlock } from './ChildrenParser';

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

    if ((token.type === 'list_item_open' || token.type === 'hr' || token.type === 'fence') && token.markup) {
      this.data.markup = token.markup;
    }

    if (token.tag === 'hr' || token.tag === 'abbr-def') {
      this.isVoid = true;
    }

    if (token.level === 0 || token.level) {
      this.data.level = token.level;
    }

    if (token.map) {
      this.data.map = token.map;
    }

    if (token.attrs) {
      this.attrs = utils.parseAttrs(token.attrs);

      if (this.attrs.style) {
        this.style = this.attrs.style;
      }
    }

    if (token.meta) {
      this.data = utils.assign(this.data, token.meta);
    }
  }
}

const RichMarkdownDeserializer = {
  stack: [],
  level: 0,
  currentBlock: null,
  blocks: [],
  parentBlock: null,
  lineCount: 0,

  init() {
    this.stack = [];
    this.level = 0;
    this.currentBlock = null;
    this.blocks = [];
    this.parentBlock = null;
    this.lineCount = 0;
  },

  /**
   * Method preprocessing get tokens list from markdown-it parser
   * and remove from this list tokens with types 'paragraph_open' and 'paragraph_close'
   * if they are between opening and closing tokens of one type
   *
   * @param tokens
   */

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
      } else if ((blockquoteLevel > 0 || bulletListLevel > 0 ||
          orderedListLevel > 0 || ddLevel > 0 || anchorLevel > 0) &&
        (token.type === 'paragraph_open' || token.type === 'paragraph_close')) {
        tokens.splice(i, 1);
      } else if (bulletListLevel > 1 &&
        token.type === 'bullet_list_close' && tokens[i + 1].type === 'bullet_list_open') {
        tokens.splice(i, 2);
      } else {
        switch (token.type) {
          case 'blockquote_open': blockquoteLevel++; break;
          case 'blockquote_close': blockquoteLevel--; break;
          case 'bullet_list_open': bulletListLevel++; break;
          case 'bullet_list_close': bulletListLevel--; break;
          case 'ordered_list_open': orderedListLevel++; break;
          case 'ordered_list_close': orderedListLevel--; break;
          case 'dd_open': ddLevel++; break;
          case 'dd_close': ddLevel--; break;
          case 'anchor_open': anchorLevel++; break;
          case 'anchor_close': anchorLevel--; break;

          case 'code_block':
          case 'fence':
            token.content = token.content.replace(/\n$/, '');
            break;

          default:
            //
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
      } else if (parentType === 'blockquote') {
        item.data.parent = parentType;
      }

      if (token.type === 'ordered-list') {
        item.data.itemNum = num++;
      }

      if (item.nodes) {
        this.addParents(item.nodes, item.data.parent);
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
        } else {
          this.setRecursiveParent(item.nodes, parent);
        }
      }
    }
  },

  getOneEmptyParagraph(begin) {
    return {
      kind: "block",
      type: "paragraph",
      data: {
        map: [begin, begin + 1]
      },
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
    };
  },

  getEmptyParagraphs(tokens, begin, end) {
    for (let i = begin; i <= end; i++) {
      tokens.push(this.getOneEmptyParagraph(i));
    }
  },

  recalcListItemMap(tokens) {
    for (let token of tokens) {
      if (token.type === 'unordered-list' || token.type === 'ordered-list') {
        for (let item of token.nodes) {
          // li
          if (item.nodes.length === 1) {
            item.data.map[1] = item.data.map[0] + 1;
          } else if (item.nodes.length > 1) { // li with sublist
            this.recalcListItemMap(item.nodes);

            item.data.map[1] = item.nodes[item.nodes.length - 1].data.map[1];
          }
        }

        token.data.map[1] = token.nodes[token.nodes.length - 1].data.map[1];
      }
    }
  },

  addEmptyParagraphs(tokens) {
    if (tokens.length === 0) {
      return tokens;
    }

    let newTokens = [];

    if (tokens[0].data.map[0] > 0) {
      this.getEmptyParagraphs(newTokens, 0, tokens[0].data.map[0] - 1);
    }

    for (let i = 0; i < tokens.length - 1; i++) {
      newTokens.push(tokens[i]);

      const firstLine = tokens[i].data.map[1];
      const lastLine = tokens[i + 1].data.map[0];

      // Add empty paragraph
      if (firstLine < lastLine) {
        this.getEmptyParagraphs(newTokens, firstLine, lastLine - 1);
      }
    }
    const lastToken = tokens[tokens.length - 1];
    newTokens.push(lastToken);

    if (this.lineCount - 1 > lastToken.data.map[1]) {
      this.getEmptyParagraphs(newTokens, lastToken.data.map[1], this.lineCount - 1);
    }

    return newTokens;
  },

  addParents(tokens) {
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
              this.addParents(item.nodes);
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
                default:
                  //
              }
            }
          }
          break;

        default:
          //
      }
    }
  },


  saveCurrentBlock() {
    if (this.currentBlock) {
      if (this.parentBlock) {
        this.parentBlock.nodes.push(this.currentBlock);
      } else {
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
    } else {
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
        const lastElem = utils.getLastElemTokenType(token);

        if (token.type === 'line_count') {
          this.lineCount = token.endLine + 1;
        }

        if (lastElem === 'open') {
          this.createBlock(token);
        } else if (token.type === 'inline' && previousType !== 'empty') {
          if (this.currentBlock.type === 'dd' || this.currentBlock.type === 'blockquote') {
            token.tag = 'p';
            this.addInlineToBlock(token);
          } else {
            this.addInlineText(token);
          }
        } else if (lastElem === 'close') {
          this.closeBlock();
        } else if (token.tag === 'code') {
          this.addCodeBlock(token);
        } else if (token.type === 'hr' || token.type === 'empty' || token.type === 'abbr-def') {
          this.addHRBlock(token);
        }
      }

      previousType = token.type;
    }
  },

  eventParse(eventTokens) {
    this.preprocessing(eventTokens);
    this.processing(eventTokens);
    this.recalcListItemMap(this.blocks);
    this.blocks = this.addEmptyParagraphs(this.blocks);
    this.addParents(this.blocks);

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

  parse(markdownData, options = []) {
    this.init();
    let fragment = null;

    if (markdownData === '') {
      fragment = this.getDefaultFragment();
    } else {
      try {
        let eventTokens = MarkdownIt.parse(markdownData || '', {});
        fragment = this.eventParse(eventTokens);
        // fragment = this.render(markdownData, options);
      } catch (e) {
        fragment = this.getDefaultFragment();
      }
    }

    return { nodes: fragment };
  },

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
  deserialize(markdown, options = []) {
    const nodes = this.parse(markdown, options);
    return Raw.deserialize(nodes, { terse: true });
  }
};

export default RichMarkdownDeserializer;
