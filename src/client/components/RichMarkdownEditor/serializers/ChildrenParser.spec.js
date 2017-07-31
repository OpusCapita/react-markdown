import { expect } from 'chai';
import { ChildrenParser } from './ChildrenParser'


function compareJSONValues(value1, value2) {
  expect(JSON.stringify(value1)).to.equal(JSON.stringify(value2));
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


describe('', () => {
  describe('ChildrenParser', () => {
    it('Common from empty array', () => {
      const tokens = [];
      const Nodes = new ChildrenParser(tokens);
      const res = {
        "_nodes": [],
        "currNode": null,
        "currTextBlock": null,
        "marks": {}
      };

      compareJSONValues(Nodes, res);
    });
  });

  describe('Links', () => {
    it('createLink step by step', () => {
      const nodes = new ChildrenParser([]);

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

      // console.log(JSON.stringify(nodes));
    });

    it('add text to link', () => {
      const nodes = new ChildrenParser([]);

      nodes.processToken(LINK_TOKENS[0]);
      const linkNode = nodes.currNode;
      linkNode.addText('New link text');
      expect(linkNode.nodes[0].ranges[0]).to.deep.include({ text: 'New link text' });
    });


    it('Create link from tokens', () => {
      const nodes = new ChildrenParser(LINK_TOKENS);

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
      const nodes = new ChildrenParser(LINK_TOKENS_1);

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
});
