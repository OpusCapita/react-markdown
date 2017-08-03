import utils from './utils';
import { ChildrenInlineParser, TextNode, TextBlock } from './ChildrenInlineParser';

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
  'abbr-def': 'abbr-def',
};

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

    this.data.level = token.level;

    if (token.map) {
      this.data.map = token.map;
    }

    if (token.attrs) {
      this.attrs = utils.parseAttrs(token.attrs);
    }

    if (token.meta) {
      this.data = { ...this.data, ...token.meta };
    }
  }
}

class MarkdownItParser {
  init() {
    this.stack = [];
    this.level = 0;
    this.currentBlock = null;
    this.blocks = [];
    this.parentBlock = null;
    this.lineCount = 0;
  }

  static getDefaultNodes() {
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
  }

  static getUnorderedList(items, level, parent) {
    return {
      "kind": "block",
      "type": "unordered-list",
      "nodes": items,
      "tag": "ul",
      "data": {
        "level": level,
        "map": [items[0].data.map[0], items[items.length - 1].data.map[1]],
        "parent": parent
      }
    };
  }

  static getOneEmptyParagraph(begin) {
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
  }

  static getEmptyParagraphs(begin, end) {
    const tokens = [];
    for (let i = begin; i <= end; i++) {
      tokens.push(MarkdownItParser.getOneEmptyParagraph(i));
    }

    return tokens;
  }

  recalcListItemMap(tokens = this.blocks) {
    for (let token of tokens) {
      if (token.type === 'unordered-list' || token.type === 'ordered-list') {
        for (let item of token.nodes) {
          // li
          if (item.nodes.length === 1) {
            item.data.map[1] = item.data.map[0] + 1;
          } else { // li with sublist
            this.recalcListItemMap(item.nodes);

            item.data.map[1] = item.nodes[item.nodes.length - 1].data.map[1];
          }
        }

        token.data.map[1] = token.nodes[token.nodes.length - 1].data.map[1];
      }
    }
  }

  /**
   * Divide into several lists the list in which there are empty lines
   *
   * @param {BlockNode} token
   * @returns {*}
   */

  static divideList(token) {
    // 0 or 1 item
    if (token.nodes.length <= 1) {
      return [token];
    }

    let tokensLists = [];
    let currTokenList = [];
    tokensLists.push(currTokenList);
    currTokenList.push(token.nodes[0]);

    for (let i = 1; i < token.nodes.length; i++) {
      if (token.nodes[i - 1].data.map[1] < token.nodes[i].data.map[0]) {
        currTokenList = [];
        tokensLists.push(currTokenList);
      }

      currTokenList.push(token.nodes[i]);
    }

    // Items without empty lines between them
    if (tokensLists.length === 1) {
      return [token];
    }

    // Create the list of the unordered lists
    const newTokens = [];
    for (let list of tokensLists) {
      let tokenObj = MarkdownItParser.getUnorderedList(list, token.data.level, token.data.parent);
      newTokens.push(tokenObj);
    }

    return newTokens;
  }

  divideLists() {
    let newTokens = [];

    for (let token of this.blocks) {
      if (token.type === 'unordered-list') {
        newTokens = newTokens.concat(MarkdownItParser.divideList(token));
      } else {
        newTokens.push(token);
      }
    }

    this.blocks = newTokens;
  }

  /**
   * addParagraphToEmptyLines
   *
   * @returns {*}
   */

  addParagraphToEmptyLines() {
    const tokens = this.blocks;
    if (tokens.length === 0) {
      return;
    }

    let newTokens = [];

    if (tokens[0].data.map[0] > 0) {
      newTokens.push.apply(newTokens, MarkdownItParser.getEmptyParagraphs(0, tokens[0].data.map[0] - 1));
    }

    for (let i = 0; i < tokens.length - 1; i++) {
      newTokens.push(tokens[i]);

      const firstLine = tokens[i].data.map[1];
      const lastLine = tokens[i + 1].data.map[0];

      // Add empty paragraph
      if (firstLine < lastLine) {
        newTokens.push.apply(newTokens, MarkdownItParser.getEmptyParagraphs(firstLine, lastLine - 1));
      }
    }
    const lastToken = tokens[tokens.length - 1];
    newTokens.push(lastToken);

    if (this.lineCount - 1 > lastToken.data.map[1]) {
      newTokens.push.apply(newTokens, MarkdownItParser.getEmptyParagraphs(lastToken.data.map[1], this.lineCount - 1));
    }

    this.blocks = newTokens;
  }

  setRecursiveParent(nodes, parent) {
    for (let item of nodes) {
      if (!item.data) {
        item.data = {};
      }

      item.data.parent = parent;

      if (item.nodes) {
        this.setRecursiveParent(item.nodes, TABLES.has(item.type) ? item.type : parent);
      }
    }
  }

  addParentType(tokens = this.blocks) {
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
            if (token.type === 'ordered-list') {
              item.data.itemNum = num++;
            }

            this.addParentType(item.nodes);
          }

          break;

        case 'dl':
          // This code will use in future
          // let isSimple = true;
          //
          // for (let item of token.nodes) {
          //   if (item.type === 'dd' && item.nodes.length > 1) {
          //     isSimple = false;
          //     break;
          //   }
          // }

          // if (isSimple) {
          token.type = 'dl-simple';

          for (let item of token.nodes) {
            switch (item.type) { // eslint-disable-line
              case 'dt':
                item.type = 'dt-simple';
                break;
              case 'dd':
                item.type = 'dd-simple';
                item.nodes = item.nodes[0].nodes; // remove p-wrapper
                break;
            }
          }
          // }
          break;

        default:
          //
      }
    }
  }

  addBlockWithChildrenNodes(token) {
    let node = new BlockNode(token);
    node.nodes = new ChildrenInlineParser(token.children).nodes;
    this.currentBlock.nodes.push(node);
  }

  setChildrenNodes(token) {
    this.currentBlock.nodes = new ChildrenInlineParser(token.children).nodes;
  }

  createBlock(token) {
    if (this.currentBlock) {
      if (this.parentBlock) {
        this.stack.push(this.parentBlock);
      }

      this.parentBlock = this.currentBlock;
    }

    this.currentBlock = new BlockNode(token);
    this.level++;
  }

  saveCurrentBlock() {
    if (this.currentBlock) {
      if (this.parentBlock) {
        this.parentBlock.nodes.push(this.currentBlock);
      } else {
        this.blocks.push(this.currentBlock);
      }

      this.currentBlock = null;
    }
  }

  moveParentBlockToCurrent() {
    if (this.parentBlock) {
      this.currentBlock = this.parentBlock;
      this.parentBlock = null;
    }

    if (this.stack.length > 0) {
      this.parentBlock = this.stack.pop();
    }
  }

  closeBlock() {
    this.level--;
    this.saveCurrentBlock();
    this.moveParentBlockToCurrent();
  }

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
  }

  addVoidBlock(token) {
    this.currentBlock = new BlockNode(token);
    this.saveCurrentBlock();
  }

  /**
   * Method preprocessing get tokens list from markdown-it parser
   * and remove from this list tokens with types 'paragraph_open' and 'paragraph_close'
   * if they are between opening and closing tokens of one type
   *
   * @param markdownItTokens
   */

  static preprocessing(markdownItTokens) {
    let tokens = markdownItTokens;
    let i = 0;
    let blockquoteLevel = 0;
    let bulletListLevel = 0;
    let orderedListLevel = 0;
    let ddLevel = 0;
    let anchorLevel = 0;

    while (i + 1 < tokens.length) {
      let token = tokens[i];

      if ((blockquoteLevel > 0 || bulletListLevel > 0 ||
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

    return tokens;
  }

  processing(tokens) {
    for (let token of tokens) {
      const lastElem = utils.getLastElemTokenType(token);

      if (token.type === 'line_count') {
        this.lineCount = token.endLine + 1;
      }

      if (lastElem === 'open') {
        this.createBlock(token);
      } else if (token.type === 'inline') {
        if (this.currentBlock.type === 'dd' || this.currentBlock.type === 'blockquote') {
          token.tag = 'p';
          this.addBlockWithChildrenNodes(token);
        } else {
          this.setChildrenNodes(token);
        }
      } else if (lastElem === 'close') {
        this.closeBlock();
      } else if (token.tag === 'code') {
        this.addCodeBlock(token);
      } else if (token.type === 'hr' || token.type === 'abbr-def') {
        this.addVoidBlock(token);
      }
    }
  }

  postprocessing() {
    this.recalcListItemMap();
    this.divideLists();
    this.addParagraphToEmptyLines();
    this.addParentType();
  }

  parse(markdownItTokens) {
    this.init();

    const tokens = MarkdownItParser.preprocessing(markdownItTokens);
    this.processing(tokens);
    this.postprocessing();

    // This console.log is necessary for debugging
    // console.log('markdown it:\n', JSON.stringify(tokens));
    // console.log(' ');
    // console.log(' ');
    // console.log('StateRender:', JSON.stringify(this.blocks));
    // console.log(' ');
    // console.log(' ');

    return this.blocks;
  }
}


export default MarkdownItParser;
