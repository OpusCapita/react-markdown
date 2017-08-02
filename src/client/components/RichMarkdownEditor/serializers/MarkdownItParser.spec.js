import { expect } from 'chai';
import MarkdownItParser from './MarkdownItParser';

function compareJSONValues(value1, value2) {
  expect(JSON.parse(JSON.stringify(value1))).to.deep.equal(value2);
}

const codeBlock = {
  "nodes": [{
    "kind": "block",
    "type": "code",
    "nodes": [{
      "kind": "text",
      "ranges": [{ "text": "// Some comments\nline 1 of code\nline 2 of code\nline 3 of code\n" }]
    }],
    "tag": "code",
    "data": { "level": 1, "map": [2, 6] }
  }]
};
const codeToken = {
  "type": "code_block",
  "tag": "code",
  "attrs": null,
  "map": [2, 6],
  "nesting": 0,
  "level": 1,
  "children": null,
  "content": "// Some comments\nline 1 of code\nline 2 of code\nline 3 of code\n",
  "markup": "",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
};
const headingToken = {
  "type": "heading_open",
  "tag": "h3",
  "attrs": null,
  "map": [0, 1],
  "nesting": 1,
  "level": 1,
  "children": null,
  "content": "",
  "markup": "###",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
};
const headingBlock = {
  "kind": "block",
  "type": "heading3",
  "nodes": [],
  "tag": "h3",
  "data": { "level": 1, "map": [0, 1] }
};
const itemBlock1 = {
  "kind": "block",
  "type": "list-item",
  "nodes": [{
    "kind": "text",
    "ranges": [{ "text": "item 1:", "marks": [] }],
    "data": { "parent": "unordered-list" }
  }],
  "tag": "li",
  "data": { "markup": "-", "level": 4, "map": [2, 3], "parent": "unordered-list" }
};
const itemBlock2 = {
  "kind": "block",
  "type": "list-item",
  "nodes": [{
    "kind": "text",
    "ranges": [{ "text": "item 2:", "marks": [] }],
    "data": { "parent": "unordered-list" }
  }],
  "tag": "li",
  "data": { "markup": "-", "level": 4, "map": [3, 4], "parent": "unordered-list" }
};
const listBlock = {
  "kind": "block",
  "type": "unordered-list",
  "nodes": [itemBlock1],
  "tag": "ul",
  "data": { "level": 3, "map": [2, 3], "parent": "unordered-list" }
};
const orderedListTokens = [{
  "type": "line_count",
  "tag": "lc",
  "attrs": null,
  "map": null,
  "nesting": 1,
  "level": 0,
  "children": null,
  "content": "",
  "markup": "",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false,
  "startLine": 1,
  "endLine": 6
}, {
  "type": "ordered_list_open",
  "tag": "ol",
  "attrs": [["start", 5]],
  "map": [1, 4],
  "nesting": 1,
  "level": 1,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_open",
  "tag": "li",
  "attrs": null,
  "map": [1, 2],
  "nesting": 1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "inline",
  "tag": "",
  "attrs": null,
  "map": [1, 2],
  "nesting": 0,
  "level": 4,
  "children": [{
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "Create a list by starting a line with",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }],
  "content": "Create a list by starting a line with",
  "markup": "",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_close",
  "tag": "li",
  "attrs": null,
  "map": null,
  "nesting": -1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_open",
  "tag": "li",
  "attrs": null,
  "map": [2, 3],
  "nesting": 1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "inline",
  "tag": "",
  "attrs": null,
  "map": [2, 3],
  "nesting": 0,
  "level": 4,
  "children": [{
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "Sub-lists are made by indenting 2 spaces:",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }],
  "content": "Sub-lists are made by indenting 2 spaces:",
  "markup": "",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_close",
  "tag": "li",
  "attrs": null,
  "map": null,
  "nesting": -1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_open",
  "tag": "li",
  "attrs": null,
  "map": [3, 4],
  "nesting": 1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "inline",
  "tag": "",
  "attrs": null,
  "map": [3, 4],
  "nesting": 0,
  "level": 4,
  "children": [{
    "type": "text",
    "tag": "",
    "attrs": null,
    "map": null,
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "Very easy!",
    "markup": "",
    "info": "",
    "meta": null,
    "block": false,
    "hidden": false
  }],
  "content": "Very easy!",
  "markup": "",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "list_item_close",
  "tag": "li",
  "attrs": null,
  "map": null,
  "nesting": -1,
  "level": 2,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}, {
  "type": "ordered_list_close",
  "tag": "ol",
  "attrs": null,
  "map": null,
  "nesting": -1,
  "level": 1,
  "children": null,
  "content": "",
  "markup": ".",
  "info": "",
  "meta": null,
  "block": true,
  "hidden": false
}];


describe('MarkdownItParser', () => {
  let markdownItParser;

  beforeEach(function() {
    markdownItParser = new MarkdownItParser([]);
    markdownItParser.init();
  });

  describe('Static code', () => {
    it('getDefaultNodes()', () => {
      const res = MarkdownItParser.getDefaultNodes();
      const target = [{
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
      compareJSONValues(res, target);
    });

    it('getOneEmptyParagraph(begin)', () => {
      const res = MarkdownItParser.getOneEmptyParagraph(15);
      const target = {
        kind: "block",
        type: "paragraph",
        data: { map: [15, 16] },
        nodes: [{ kind: "text", ranges: [{ "text": "" }] }]
      };
      compareJSONValues(res, target);
    });

    it('getEmptyParagraphs(begin, end)', () => {
      const res = MarkdownItParser.getEmptyParagraphs(12, 14);
      const target = [
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [12, 13] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [13, 14] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [14, 15] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        }
      ];
      compareJSONValues(res, target);
      expect(res.length).to.equal(3);

      // console.log(JSON.stringify(res));
    });
  });

  describe('this.postprocessing()', () => {
    it('list - paragraph', () => {
      markdownItParser.blocks = [{
        "kind": "block",
        "type": "unordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }] }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [0, 1] }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }]
          }, {
            "kind": "block",
            "type": "unordered-list",
            "nodes": [{
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Marker character change forces new list start:", "marks": [] }]
              }],
              "tag": "li",
              "data": { "markup": "-", "level": 4, "map": [2, 5] }
            }],
            "tag": "ul",
            "data": { "level": 3, "map": [2, 5] }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [1, 5] }
        }],
        "tag": "ul",
        "data": { "level": 1, "map": [0, 5] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "End line", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [5, 6] }
      }];

      const target1 = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }]
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1] }
            }, {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }]
              }, {
                "kind": "block",
                "type": "unordered-list",
                "nodes": [{
                  "kind": "block",
                  "type": "list-item",
                  "nodes": [{
                    "kind": "text",
                    "ranges": [{ "text": "Marker character change forces new list start:", "marks": [] }]
                  }],
                  "tag": "li",
                  "data": { "markup": "-", "level": 4, "map": [2, 3] }
                }],
                "tag": "ul",
                "data": { "level": 3, "map": [2, 3] }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 3] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 3] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "End line", "marks": [] }] }],
          "tag": "p",
          "data": { "level": 1, "map": [5, 6] }
        }
      ];

      markdownItParser.recalcListItemMap();
      compareJSONValues(markdownItParser.blocks, target1);

      const target2 = [{
        "kind": "block",
        "type": "unordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }] }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [0, 1] }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }]
          }, {
            "kind": "block",
            "type": "unordered-list",
            "nodes": [{
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Marker character change forces new list start:", "marks": [] }]
              }],
              "tag": "li",
              "data": { "markup": "-", "level": 4, "map": [2, 3] }
            }],
            "tag": "ul",
            "data": { "level": 3, "map": [2, 3] }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [1, 3] }
        }],
        "tag": "ul",
        "data": { "level": 1, "map": [0, 3] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [3, 4] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [4, 5] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "End line", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [5, 6] }
      }];

      markdownItParser.divideLists();
      markdownItParser.addParagraphToEmptyLines();
      compareJSONValues(markdownItParser.blocks, target2);

      const target3 = [{
        "kind": "block",
        "type": "unordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [0, 1], "parent": "unordered-list" }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }, {
            "kind": "block",
            "type": "unordered-list",
            "nodes": [{
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Marker character change forces new list start:", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "-", "level": 4, "map": [2, 3], "parent": "unordered-list" }
            }],
            "tag": "ul",
            "data": { "level": 3, "map": [2, 3], "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [1, 3], "parent": "unordered-list" }
        }],
        "tag": "ul",
        "data": { "level": 1, "map": [0, 3] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [3, 4] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [4, 5] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "End line", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [5, 6] }
      }];

      markdownItParser.addParentType();
      compareJSONValues(markdownItParser.blocks, target3);
    });

    it('list - list', () => {
      markdownItParser.blocks = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 1", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 2", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 3", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 5] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 4", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 5", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 6", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 8] }
        }
      ];

      const target1 = [{
        "kind": "block",
        "type": "unordered-list",
        "nodes": [
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 1", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [0, 1] }
          },
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 2", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [1, 2] }
          },
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 3", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [2, 3] }
          },
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 4", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [5, 6] }
          },
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 5", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [6, 7] }
          },
          {
            "kind": "block",
            "type": "list-item",
            "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 6", "marks": [] }] }],
            "tag": "li",
            "data": { "markup": "+", "level": 2, "map": [7, 8] }
          }
        ],
        "tag": "ul",
        "data": { "level": 1, "map": [0, 8] }
      }];

      markdownItParser.recalcListItemMap();
      compareJSONValues(markdownItParser.blocks, target1);

      const target2 = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 1", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 2", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 3", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 3] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 3] }
        },
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 4", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 5", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 6", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [5, 8] }
        }
      ];

      markdownItParser.divideLists();
      compareJSONValues(markdownItParser.blocks, target2);

      const target3 = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 1", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 2", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 3", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 3] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 3] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [3, 4] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [4, 5] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 4", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 5", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 6", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [5, 8] }
        }
      ];

      markdownItParser.addParagraphToEmptyLines();
      compareJSONValues(markdownItParser.blocks, target3);

      const target4 = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 1", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 2", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 3", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 3], "parent": "unordered-list" }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 3] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [3, 4] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [4, 5] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 4", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 5", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 6", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8], "parent": "unordered-list" }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [5, 8] }
        }
      ];

      markdownItParser.addParentType();
      compareJSONValues(markdownItParser.blocks, target4);
    });

    it('complex', () => {
      markdownItParser.blocks = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 1", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 2", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 3", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 5] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 4", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 5", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7] }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{ "kind": "text", "ranges": [{ "text": "Item 6", "marks": [] }] }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8] }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 8] }
        }
      ];

      const target = [
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 1", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [0, 1], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 2", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [1, 2], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 3", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [2, 3], "parent": "unordered-list" }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [0, 3] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [3, 4] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [4, 5] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "unordered-list",
          "nodes": [
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 4", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [5, 6], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 5", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [6, 7], "parent": "unordered-list" }
            },
            {
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item 6", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "+", "level": 2, "map": [7, 8], "parent": "unordered-list" }
            }
          ],
          "tag": "ul",
          "data": { "level": 1, "map": [5, 8] }
        }
      ];

      markdownItParser.postprocessing();
      compareJSONValues(markdownItParser.blocks, target);
    });

    it('this.addParagraphToEmptyLines()', () => {
      markdownItParser.blocks = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph one.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph two.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph three", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [6, 7] }
      }];
      markdownItParser.lineCount = 10;

      const target = [{
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [0, 1] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [1, 2] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph one.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [3, 4] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph two.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [5, 6] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph three", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [6, 7] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [7, 8] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [8, 9] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [9, 10] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }];

      markdownItParser.addParagraphToEmptyLines();
      compareJSONValues(markdownItParser.blocks, target);
    });

    it('this.addParagraphToEmptyLines() #2', () => {
      markdownItParser.blocks = [];
      markdownItParser.addParagraphToEmptyLines();
      compareJSONValues(markdownItParser.blocks, []);
    });

    it('MarkdownItParser.divideList(token)', () => {
      const token1 = {
        nodes: []
      };
      const token2 = {
        nodes: [
          { childToken: { } }
        ]
      };
      compareJSONValues(MarkdownItParser.divideList(token1), [token1]);
      compareJSONValues(MarkdownItParser.divideList(token2), [token2]);
    });
  });

  describe('various blocks', () => {
    it('addVoidBlock(token)', () => {
      const token = {
        "type": "hr",
        "tag": "hr",
        "attrs": null,
        "map": [2, 3],
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "",
        "markup": "___",
        "info": "",
        "meta": null,
        "block": true,
        "hidden": false
      };
      markdownItParser.addVoidBlock(token);
      const res = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "___", "level": 1, "map": [2, 3] },
        "isVoid": true
      }];

      compareJSONValues(markdownItParser.blocks, res);
      expect(markdownItParser.currentBlock).to.equal(null);
    });

    it('addCodeBlock(token)', () => {
      const res = [{
        "kind": "block",
        "type": "code",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "// Some comments\nline 1 of code\nline 2 of code\nline 3 of code\n" }]
        }],
        "tag": "code",
        "data": { "level": 1, "map": [2, 6] }
      }];

      markdownItParser.addCodeBlock(codeToken);
      compareJSONValues(markdownItParser.blocks, res);
    });

    it('addCodeBlock(token), level > 0', () => {
      const resCurrentBlock = {
        "nodes": [{
          "kind": "block",
          "type": "code",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "// Some comments\nline 1 of code\nline 2 of code\nline 3 of code\n" }]
          }],
          "tag": "code",
          "data": { "level": 1, "map": [2, 6] }
        }]
      };

      markdownItParser.level = 1;
      markdownItParser.currentBlock = {
        nodes: []
      };

      markdownItParser.addCodeBlock(codeToken);
      compareJSONValues(markdownItParser.blocks, []);
      compareJSONValues(markdownItParser.currentBlock, resCurrentBlock);
    });
  });

  describe('save and close blocks', () => {
    it('closeBlock()', () => {
      const resBlocks = [codeBlock];

      markdownItParser.level = 1;
      markdownItParser.currentBlock = {
        nodes: []
      };
      markdownItParser.addCodeBlock(codeToken);
      markdownItParser.closeBlock();

      compareJSONValues(markdownItParser.blocks, resBlocks);
      compareJSONValues(markdownItParser.currentBlock, null);
      expect(markdownItParser.level).to.equal(0);
    });

    it('moveParentBlockToCurrent(), empty parent, empty stack', () => {
      markdownItParser.moveParentBlockToCurrent();
      expect(markdownItParser.currentBlock).to.equal(null);
      expect(markdownItParser.parentBlock).to.equal(null);
      expect(markdownItParser.stack.length).to.equal(0);
    });

    it('moveParentBlockToCurrent()', () => {
      markdownItParser.stack = [
        listBlock,
      ];
      markdownItParser.parentBlock = codeBlock;

      expect(markdownItParser.stack.length).to.equal(1);
      expect(markdownItParser.currentBlock).to.equal(null);

      markdownItParser.moveParentBlockToCurrent();

      expect(markdownItParser.currentBlock).to.equal(codeBlock);
      expect(markdownItParser.parentBlock).to.equal(listBlock);
      expect(markdownItParser.stack.length).to.equal(0);
    });

    it('saveCurrentBlock()', () => {
      markdownItParser.saveCurrentBlock();

      expect(markdownItParser.currentBlock).to.equal(null);
      expect(markdownItParser.parentBlock).to.equal(null);
      expect(markdownItParser.stack.length).to.equal(0);

      markdownItParser.currentBlock = listBlock;
      markdownItParser.saveCurrentBlock();
      expect(markdownItParser.currentBlock).to.equal(null);
      expect(markdownItParser.parentBlock).to.equal(null);
      compareJSONValues(markdownItParser.blocks, [listBlock]);


      markdownItParser.parentBlock = listBlock;
      markdownItParser.currentBlock = itemBlock2;
      markdownItParser.saveCurrentBlock();
      const res = {
        "kind": "block",
        "type": "unordered-list",
        "nodes": [itemBlock1, itemBlock2],
        "tag": "ul",
        "data": { "level": 3, "map": [2, 3], "parent": "unordered-list" }
      };
      compareJSONValues(markdownItParser.parentBlock, res);
      expect(markdownItParser.currentBlock).to.equal(null);
    });
  });

  describe('Create blocks', () => {
    it('createBlock(token)', () => {
      markdownItParser.parentBlock = listBlock;
      markdownItParser.currentBlock = itemBlock2;
      markdownItParser.level = 3;
      markdownItParser.createBlock(headingToken);

      compareJSONValues(markdownItParser.stack, [listBlock]);
      compareJSONValues(markdownItParser.parentBlock, itemBlock2);
      compareJSONValues(markdownItParser.currentBlock, headingBlock);
      expect(markdownItParser.level).to.equal(4);
    });

    it('createBlock(token) - default', () => {
      const token = {
        "type": "list-list",
        "tag": "ll",
        "attrs": null,
        "map": [3, 4],
        "nesting": 1,
        "level": 2,
        "children": null,
        "content": "",
        "markup": ".",
        "info": "",
        "meta": null,
        "block": true,
        "hidden": false
      };
      let res = {
        "kind": "block",
        "type": "default",
        "nodes": [],
        "tag": "ll",
        "data": { "level": 2, "map": [3, 4] }
      };
      markdownItParser.createBlock(token);

      compareJSONValues(markdownItParser.blocks, []);
      compareJSONValues(markdownItParser.currentBlock, res);
      expect(markdownItParser.level).to.equal(1);
    });
  });

  describe('Processing', () => {
    it('processing(tokens)', () => {
      const res = [{
        "kind": "block",
        "type": "ordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }] }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [1, 2] }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }]
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [2, 3] }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Very easy!", "marks": [] }] }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [3, 4] }
        }],
        "tag": "ol",
        "data": { "level": 1, "map": [1, 4] },
        "attrs": { "start": 5 }
      }];
      const res1 = [{
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [0, 1] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "ordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Create a list by starting a line with", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [1, 2], "parent": "ordered-list", "itemNum": 5 }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces:", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [2, 3], "parent": "ordered-list", "itemNum": 6 }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Very easy!", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [3, 4], "parent": "ordered-list", "itemNum": 7 }
        }],
        "tag": "ol",
        "data": { "level": 1, "map": [1, 4] },
        "attrs": { "start": 5 }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [4, 5] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [5, 6] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [6, 7] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }];

      markdownItParser.processing(orderedListTokens);
      compareJSONValues(markdownItParser.blocks, res);
      markdownItParser.postprocessing(orderedListTokens);
      compareJSONValues(markdownItParser.blocks, res1);

      // console.log(JSON.stringify(markdownItParser.blocks));
      // console.log(JSON.stringify(markdownItParser.currentBlock));
    });
  });
});
