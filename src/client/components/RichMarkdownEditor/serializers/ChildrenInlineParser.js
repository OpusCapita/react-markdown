import Utils from './utils';

const markups = {
  '**': 'bold',
  '__': 'bold',
  '++': 'underline',
  '==': 'mark',
  '*': 'italic',
  '^': 'sup',
  '_': 'italic',
  '~~': 'strikethrough',
  '~': 'sub',
  '`': 'code',
  linkify: 'linkify',
  autocomplete: 'autocomplete'
};

function getSimpleNodes() {
  return [
    {
      kind: "text",
      ranges: [
        {
          "text": ''
        }
      ]
    }
  ];
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
  constructor(link, title) {
    super();

    this.type = "link";
    this.isVoid = false;
    this.nodes = getSimpleNodes();
    this.data = {
      href: link
    };

    if (title !== '') {
      this.data.title = title;
    }
  }

  addText(text) {
    this.nodes[0].ranges[0].text = text;
  }

  setMarks(marks) {
    this.nodes[0].ranges[0].marks = [];

    for (let mark in marks) {
      if (mark !== '') {
        this.nodes[0].ranges[0].marks.push({
          type: markups[mark],
          data: { markup: mark }
        });
      }
    }
  }
}

class AbbrNode extends InlineNode {
  constructor(title) {
    super();

    this.type = "abbr";
    this.isVoid = false;
    this.nodes = getSimpleNodes();
    this.data = {
      title: title
    };
  }

  addText(text) {
    this.nodes[0].ranges[0].text = text;
  }
}

// This code will use in future
//
// class AutocompleteNode extends InlineNode {
//   constructor(id) {
//     super();
//
//     this.type = "autocomplete";
//     this.isVoid = false;
//     this.nodes = getSimpleNodes();
//     this.data = {
//       id: id
//     };
//   }
//
//   addText(text) {
//     this.nodes[0].ranges[0].text = text;
//   }
// }

class ImageNode extends InlineNode {
  constructor(title, src, alt) {
    super();
    this.type = "image";
    this.data = {
      title: title,
      src: src,
    };

    if (alt !== '') {
      this.data.alt = alt;
    }
  }
}

class TextBlock {
  constructor(token) {
    this.text = '';

    if (token.markup && markups[token.markup]) {
      this.marks = [
        {
          type: markups[token.markup],
          data: { markup: token.markup }
        }
      ];
    }
  }

  setText(text) {
    this.text = text;
  }

  setMarks(marks) {
    this.marks = [];

    for (let mark in marks) {
      if (mark !== '') {
        this.marks.push({
          type: markups[mark],
          data: { markup: mark }
        });
      }
    }
  }
}

class ChildrenInlineParser {
  constructor(tokens) {
    this._nodes = [];
    this.currNode = null;
    this.currTextBlock = null;
    this.marks = {};

    this.createNodes(tokens);
  }

  get nodes() {
    return this._nodes;
  }

  addCurrNode() {
    if (this.currNode) {
      if (this.currNode.kind === 'text') {
        this.addTextBlock();
      }

      this._nodes.push(this.currNode);
      this.currNode = null;
    }
  }

  addTextBlock() {
    if (this.currTextBlock) {
      this.currNode.addTextBlock(this.currTextBlock);
      this.currTextBlock = null;
    }
  }

  createLink(token) {
    this.addCurrNode();

    let link = '';
    let title = '';

    for (let attr of token.attrs) {
      switch (attr[0]) {
        case 'href':
          link = attr[1];
          break;

        case 'title':
          title = attr[1];
          break;

        default:
          //
      }
    }

    this.currNode = new LinkNode(link, title);
  }

  createAbbr(token) {
    this.addCurrNode();

    let title = '';

    for (let attr of token.attrs) {
      if (attr[0] === 'title') {
        title = attr[1];
        break;
      }
    }

    this.currNode = new AbbrNode(title);
  }

  createImage(token) {
    let src = '';
    let alt = '';
    let title = token.content;

    for (let attr of token.attrs) {
      if (attr[0] === 'src') {
        src = attr[1];
      } else if (attr[0] === 'title') {
        alt = attr[1];
      }
    }

    this.currNode = new ImageNode(title, src, alt);
    this.addCurrNode();
  }

  // This code will use in future
  //
  // createAutocomplete(token) {
  //   this.addCurrNode();
  //   this.currNode = new AutocompleteNode(token.meta.id);
  //   this.currNode.addText(token.content);
  //   this.addCurrNode();
  // }

  addTextToNode(token) {
    const lastElem = Utils.getLastElemTokenType(token);

    if (!this.currNode) {
      this.currNode = new TextNode();
    }

    if (token.type === 'code_inline' || token.type === 'emoji') {
      this.addTextBlock();
      this.currTextBlock = new TextBlock(token);
      this.currTextBlock.setText(token.content);
      this.addTextBlock();
    }

    // Add token's mark to this marks
    if (lastElem === 'open') {
      if (token.markup !== '') {
        this.marks[token.markup] = true;
      }
    }

    // Add this marks to text's block
    if (token.type === 'text') {
      this.currTextBlock = new TextBlock(token);
      this.currTextBlock.setText(token.content);

      if (this.marks !== {}) {
        this.currTextBlock.setMarks(this.marks);
      }

      this.addTextBlock();
    }

    // Remove token's mark from this marks
    if (lastElem === 'close') {
      if (token.markup !== '') {
        delete this.marks[token.markup];
      }
    }
  }

  processToken(token) {
    if (token.type === 'link_open') {
      this.createLink(token);
    }

    if (token.type === 'abbr_open') {
      this.createAbbr(token);
    } else if (token.type === 'image') {
      this.createImage(token);
    // This code will use in future
    //
    // } else if (token.type === 'autocomplete') {
    //   this.createAutocomplete(token);
    } else if (token.type === 'text' && this.currNode &&
      (this.currNode.type === 'link' || this.currNode.type === 'abbr')) {
      this.currNode.addText(token.content);
      if (this.currNode.type === 'link') {
        this.currNode.setMarks(this.marks);
      }
    } else if (token.type === 'link_close' || token.type === 'abbr_close') {
      this.addCurrNode();
    } else {
      this.addTextToNode(token);
    }
  }

  closeCurrNode() {
    if (this.currNode) {
      if (this.currTextBlock) {
        this.addTextBlock();
      }

      this.addCurrNode();
    }
  }

  createNodes(tokens) {
    for (let token of tokens) {
      this.processToken(token);
    }

    this.closeCurrNode();

    return this._nodes;
  }
}

export { ChildrenInlineParser, TextNode, TextBlock };
