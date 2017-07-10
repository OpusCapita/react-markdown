// import MarkdownIt from 'markdown-it';
import MarkdownIt from 'js-slate-markdown-serializer';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItIns from 'markdown-it-ins';
import MarkdownItMark from 'markdown-it-mark';


const markdown = new MarkdownIt();

markdown
  .use(MarkdownItSub)
  .use(MarkdownItSup)
  .use(MarkdownItIns)
  .use(MarkdownItMark);


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
};

const markups = {
  '**': 'bold',
  '__': 'bold',
  '++': 'insert',
  '==': 'mark',
  '*': 'italic',
  '^': 'sup',
  '_': 'italic',
  '~~': 'strikethrough',
  '~': 'sub',
  '`': 'code'
};

function parseAttrs(attrs) {
  let objAttrs = {};

  for (let attr of attrs) {
    objAttrs[attr[0]] = attr[1];
  }

  return objAttrs;
}

class BlockNode {
  constructor(token, isDefault) {
    isDefault = isDefault || false;
    this.kind = "block";
    this.type = isDefault ? 'default' : types[token.tag];
    this.nodes = [];

    if (token.tag === 'hr') {
      this.isVoid = true;
    }

    if (token.level === 0 || token.level) {
      this.data = {
        level: token.level
      };
    }

    if (token.attrs) {
      this.attrs = parseAttrs(token.attrs);

      if (this.attrs.style) {
        this.style = this.attrs.style;
      }
    }
  }
}

function getBlock(token) {
  if (token.tag in types) {
    return new BlockNode(token);
  }

  else {
    return new BlockNode(token, true);
  }
}

class TextNode {
  kind = 'text';
  ranges = [];

  addTextBlock = textBlock => this.ranges.push(textBlock);
}

class InlineNode {
  kind = 'inline';
  isVoid = true;
  nodes = [];
}

class LinkNode extends InlineNode {
  constructor(link) {
    super();

    this.type = "link";
    this.isVoid = false;
    this.nodes = [
      {
        kind: "text",
        ranges: [
          {
            "text": ''
          }
        ]
      }
    ];
    this.data = {
      href: link
    };
  }

  addText(text) {
    this.nodes[0].ranges[0].text = text;
  }
}

class ImageNode extends InlineNode {
  constructor(src, alt) {
    super();
    this.type = "image";
    this.data = {
      src: src,
      alt: alt,
    };
  }
}

class SoftBreakNode extends InlineNode {
  constructor() {
    super();
    this.type = "softbreak";
  }
}

class TextBlock {
  constructor(token) {
    this.text = '';

    if (token.markup && markups[token.markup]) {
      this.marks = [{type: markups[token.markup]}];
    }
  }

  setText(text) {
    this.text = text;
  }
}

function getNodes(tokens) {
  let nodes = [];
  let currNode = null;
  let currTextBlock = null;

  function addCurrNode() {
    if (currNode) {
      if (currNode.kind === 'text') {
        addTextBlock();
      }

      nodes.push(currNode);
      currNode = null;
    }
  }

  function addTextBlock() {
    if (currTextBlock) {
      currNode.addTextBlock(currTextBlock);
      currTextBlock = null;
    }
  }

  for (let token of tokens) {
    const lastElem = getLastElemTokenType(token);

    if (token.type === 'link_open') {
      addCurrNode();

      let link = '';

      for (let attr of token.attrs) {
        if (attr[0] === 'href') {
          link = attr[1];
          break;
        }
      }

      currNode = new LinkNode(link);
    }

    else if (token.type === 'image') {
      let src = '';
      let alt = '';

      for (let attr of token.attrs) {
        if (attr[0] === 'src') {
          src = attr[1];
        }

        else if (attr[0] === 'title') {
          alt = attr[1];
        }
      }

      currNode = new ImageNode(src, alt);
      addCurrNode();
    }

    else if (token.type === 'softbreak') {
      currNode = new SoftBreakNode();
      addCurrNode();
    }

    else if (token.type === 'text' && currNode && currNode.type === 'link') {
      currNode.addText(token.content);
    }

    else if (token.type === 'link_close') {
      addCurrNode();
    }

    else {
      if (!currNode) {
        currNode = new TextNode();
      }

      if (lastElem === 'open' || token.type === 'code_inline') {
        addTextBlock();

        currTextBlock = new TextBlock(token);
      }

      if (token.type === 'text' || token.type === 'code_inline') {
        if (!currTextBlock) {
          currTextBlock = new TextBlock(token);
        }
        currTextBlock.setText(token.content);
      }

      if (lastElem === 'close' || token.type === 'code_inline') {
        addTextBlock();
      }
    }
  }

  if (currNode) {
    if (currTextBlock) {
      addTextBlock();
    }

    addCurrNode();
  }

  return nodes;
}

function getLastElemTokenType(token) {
  const tokenData = token.type.split('_');
  return tokenData[tokenData.length - 1];
}


const StateRender = {
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

    while (i + 1 < tokens.length) {
      if ((blockquoteLevel > 0 || bulletListLevel > 0 || orderedListLevel > 0)
        && (tokens[i].type === 'paragraph_open' || tokens[i].type === 'paragraph_close')) {
        tokens.splice(i, 1);
      }

      else if (bulletListLevel > 1
        && tokens[i].type === 'bullet_list_close' && tokens[i + 1].type === 'bullet_list_open') {
        tokens.splice(i, 2);
      }

      else {
        if (tokens[i].type === 'blockquote_open') {
          blockquoteLevel++;
        }

        else if (tokens[i].type === 'blockquote_close') {
          blockquoteLevel--;
        }

        else if (tokens[i].type === 'bullet_list_open') {
          bulletListLevel++;
        }

        else if (tokens[i].type === 'bullet_list_close') {
          bulletListLevel--;
        }

        else if (tokens[i].type === 'ordered_list_open') {
          orderedListLevel++;
        }

        else if (tokens[i].type === 'ordered_list_close') {
          orderedListLevel--;
        }

        i++;
      }
    }
  },

  postprocessing(tokens) {
    for (let token of tokens) {
      let parent = '';

      switch (token.type) {
        case 'ordered-list':
        case 'unordered-list':
        case 'blockquote':
          parent = token.type;
          let num = 1;

          for (let item of token.nodes) {
            if (!item.data) {
              item.data = {};
            }

            item.data.parent = parent;

            if (token.type === 'ordered-list') {
              item.data.itemNum = num++;
            }

            if (item.nodes) {
              this.postprocessing(item.nodes);
            }
          }

          break;
      }
    }
  },

  parse(tokens) {
    let currTag = '';

    // console.log('markdown it pre:\n', Utils.arrToStr(tokens));

    this.preprocessing(tokens);

    // console.log('markdown it:\n', Utils.arrToStr(tokens));
    // console.log('markdown it:\n', JSON.stringify(tokens));
    // console.log(' ');
    // console.log(' ');

    for (let token of tokens) {
      if (token.type) {
        const lastElem = getLastElemTokenType(token);

        if (token.tag) {
          currTag = token.tag;
        }

        if (lastElem === 'open' || token.type === 'hr' || token.tag === 'code') {
          if (this.currentBlock) {
            if (this.parentBlock) {
              this.stack.push(this.parentBlock);
            }

            this.parentBlock = this.currentBlock;
          }

          this.currentBlock = getBlock(token);
          this.level++;
        }

        if (this.currentBlock && token.type === 'inline') {
          if (currTag in types && token.children) {
            this.currentBlock.nodes = getNodes(token.children);
          }
        }

        if (token.tag === 'code' || this.currentBlock && this.currentBlock.type === 'default') {
          let node = new TextNode();
          let textBlock = new TextBlock({});
          textBlock.setText(token.content);
          node.addTextBlock(textBlock);
          this.currentBlock.nodes.push(node);
        }

        if (lastElem === 'close' || token.type === 'hr' || token.tag === 'code') {
          this.level--;

          if (this.currentBlock) {
            if (this.parentBlock) {
              this.parentBlock.nodes.push(this.currentBlock);
            }

            else {
              this.blocks.push(this.currentBlock);
            }

            this.currentBlock = null;
          }

          if (this.parentBlock) {
            this.currentBlock = this.parentBlock;
            this.parentBlock = null;
          }

          if (this.stack.length > 0) {
            this.parentBlock = this.stack.pop();
          }
        }
      }
    }

    this.postprocessing(this.blocks);

    // console.log('StateRender:');
    // console.log(JSON.stringify(this.blocks));

    return this.blocks;
  },

  render(markdownData) {
    this.init();
    let tokens = markdown.parse(markdownData || '');

    return this.parse(tokens);
  }
};

export default StateRender;