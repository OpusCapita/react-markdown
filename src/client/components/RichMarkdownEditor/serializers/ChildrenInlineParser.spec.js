import { expect } from 'chai';
import { ChildrenInlineParser } from './ChildrenInlineParser'


function compareJSONValues(value1, value2) {
  expect(JSON.parse(JSON.stringify(value1))).to.deep.equal(value2);
}

const LINK_TOKENS = [
  {
    "type": "link_open",
    "tag": "a",
    "attrs": [["href", "http://dev.nodeca.com"]],
    "map": null,
    "nesting": 1,
    "level": 1,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 1,
    "children": null,
    "content": "link text",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "link_close",
    "tag": "a",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }
];
const LINK_TOKENS_1 = [
  {
    "type": "link_open",
    "tag": "a",
    "attrs": [["href", "http://nodeca.github.io/pica/demo/"], ["title", "title text!"]],
    "map": null,
    "nesting": 1,
    "level": 1,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 1,
    "children": null,
    "content": "link with title",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  },
  {
    "type": "link_close",
    "tag": "a",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }
];


describe('ChildrenInlineParser', () => {
  let nodes;

  beforeEach(function() {
    nodes = new ChildrenInlineParser([]);
  });

  describe('Common', () => {
    it('Common from empty array', () => {
      const res = {
        "_nodes": [],
        "currNode": null,
        "currTextBlock": null,
        "marks": {}
      };

      compareJSONValues(nodes, res);
    });
  });

  describe('Links', () => {
    it('createLink step by step', () => {
      nodes.processToken(LINK_TOKENS[0]);
      let res = {
        "_nodes": [],
        "currNode": {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        },
        "currTextBlock": null,
        "marks": {}
      };
      compareJSONValues(nodes, res);

      nodes.processToken(LINK_TOKENS[1]);
      res = {
        "_nodes": [],
        "currNode": {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "link text", "marks": [] }] }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        },
        "currTextBlock": null,
        "marks": {}
      };
      compareJSONValues(nodes, res);

      nodes.processToken(LINK_TOKENS[2]);
      res = {
        "_nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "link text", "marks": [] }] }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }], "currNode": null, "currTextBlock": null, "marks": {}
      };
      compareJSONValues(nodes, res);

      expect(nodes._nodes.length).to.equal(1);

      const node = nodes._nodes[0];

      expect(node).to.deep.include({ kind: 'inline' });
      expect(node).to.deep.include({ isVoid: false });
      expect(node).to.deep.include({ type: 'link' });
      expect(node.data).to.deep.include({ href: 'http://dev.nodeca.com' });
      expect(node.nodes.length).to.equal(1);
      expect(node.nodes[0].ranges.length).to.equal(1);
      expect(node.nodes[0].ranges[0]).to.deep.include({ text: 'link text' });
    });

    it('this.createLink(token)', () => {
      nodes.createLink(LINK_TOKENS[0]);
      let res = {
        "_nodes": [],
        "currNode": {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        },
        "currTextBlock": null,
        "marks": {}
      };
      compareJSONValues(nodes, res);
    });

    it('add text to link', () => {
      nodes.processToken(LINK_TOKENS[0]);
      const linkNode = nodes.currNode;
      linkNode.addText('New link text');
      expect(linkNode.nodes[0].ranges[0]).to.deep.include({ text: 'New link text' });
    });

    it('Create link from tokens', () => {
      nodes = new ChildrenInlineParser(LINK_TOKENS);

      const res = {
        "_nodes": [
          {
            "kind": "inline",
            "isVoid": false,
            "nodes": [
              {
                "kind": "text",
                "ranges": [{ "text": "link text", "marks": [] }]
              }
            ],
            "type": "link",
            "data": { "href": "http://dev.nodeca.com" }
          }
        ],
        "currNode": null,
        "currTextBlock": null,
        "marks": {}
      };

      compareJSONValues(nodes, res);

      expect(nodes._nodes.length).to.equal(1);

      const node = nodes._nodes[0];

      expect(node).to.deep.include({ kind: 'inline' });
      expect(node).to.deep.include({ isVoid: false });
      expect(node).to.deep.include({ type: 'link' });
      expect(node.data).to.deep.include({ href: 'http://dev.nodeca.com' });
      expect(node.nodes.length).to.equal(1);
      expect(node.nodes[0].ranges.length).to.equal(1);
      expect(node.nodes[0].ranges[0]).to.deep.include({ text: 'link text' });
    });

    it('Create link with title', () => {
      nodes = new ChildrenInlineParser(LINK_TOKENS_1);

      const res = {
        "_nodes": [
          {
            "kind": "inline",
            "isVoid": false,
            "nodes": [
              {
                "kind": "text",
                "ranges": [{ "text": "link with title", "marks": [] }]
              }
            ],
            "type": "link",
            "data": {
              "href": "http://nodeca.github.io/pica/demo/",
              "title": "title text!"
            }
          }
        ],
        "currNode": null,
        "currTextBlock": null,
        "marks": {}
      };

      compareJSONValues(nodes, res);

      expect(nodes._nodes.length).to.equal(1);

      const node = nodes._nodes[0];

      expect(node).to.deep.include({ kind: 'inline' });
      expect(node).to.deep.include({ isVoid: false });
      expect(node).to.deep.include({ type: 'link' });
      expect(node.data).to.deep.include({ href: 'http://nodeca.github.io/pica/demo/' });
      expect(node.data).to.deep.include({ title: 'title text!' });
      expect(node.nodes.length).to.equal(1);
      expect(node.nodes[0].ranges.length).to.equal(1);
      expect(node.nodes[0].ranges[0]).to.deep.include({ text: 'link with title' });
    });
  });

  describe('Images', () => {
    const IMAGE_TOKEN = [{
      "type": "image",
      "tag": "img",
      "attrs": [["src", "https://octodex.github.com/images/minion.png"], ["alt", ""]],
      "map": null,
      "nesting": 0,
      "level": 0,
      "children": [{
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "Minion",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }],
      "content": "Minion",
      "markup": "",
      "info": "",
      "meta": null,
      "block": false,
      "hidden": false
    }];
    const res = {
      "_nodes": [
        {
          "kind": "inline",
          "isVoid": true,
          "nodes": [],
          "type": "image",
          "data": {
            "title": "Minion",
            "src": "https://octodex.github.com/images/minion.png"
          }
        }
      ],
      "currNode": null,
      "currTextBlock": null,
      "marks": {}
    };

    it('Create Image from tokens', () => {
      nodes = new ChildrenInlineParser(IMAGE_TOKEN);

      compareJSONValues(nodes, res);

      expect(nodes._nodes.length).to.equal(1);

      const node = nodes._nodes[0];
      expect(node).to.deep.include({ kind: 'inline' });
      expect(node).to.deep.include({ isVoid: true });
      expect(node).to.deep.include({ type: 'image' });
      expect(node.data).to.deep.include({ src: 'https://octodex.github.com/images/minion.png' });
      expect(node.data).to.deep.include({ title: 'Minion' });
      expect(node.nodes.length).to.equal(0);
    });

    it('create Image step by step', () => {
      nodes.processToken(IMAGE_TOKEN[0]);
      compareJSONValues(nodes, res);
    });

    it('this.createImage(token)', () => {
      nodes.createImage(IMAGE_TOKEN[0]);
      compareJSONValues(nodes, res);
    });
  });

  describe('Abbreviations', () => {
    const ABBREVIATION_TOKENS = [
      {
        "type": "abbr_open",
        "tag": "abbr",
        "attrs": [["title", "Personal Home Page"]],
        "map": null,
        "nesting": 1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "PHP",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "abbr_close",
        "tag": "abbr",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ];
    const res = {
      "_nodes": [{
        "kind": "inline",
        "isVoid": false,
        "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
        "type": "abbr",
        "data": { "title": "Personal Home Page" }
      }], "currNode": null, "currTextBlock": null, "marks": {}
    };

    it('Create abbreviation from tokens', () => {
      nodes = new ChildrenInlineParser(ABBREVIATION_TOKENS);
      compareJSONValues(nodes, res);
    });

    it('Create abbreviation step by step', () => {
      nodes.processToken(ABBREVIATION_TOKENS[0]);
      nodes.processToken(ABBREVIATION_TOKENS[1]);
      nodes.processToken(ABBREVIATION_TOKENS[2]);
      compareJSONValues(nodes, res);
    });

    it('this.createAbbr(token)', () => {
      nodes.createAbbr(ABBREVIATION_TOKENS[0]);
      const resFromCreateAbbr = {
        "_nodes": [],
        "currNode": {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        },
        "currTextBlock": null,
        "marks": {}
      };
      compareJSONValues(nodes, resFromCreateAbbr);
    });
  });
});
