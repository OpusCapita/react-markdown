import { expect } from 'chai';
import serialize from './RichMarkdownSerializer';
import { Raw } from 'slate'


function reparser(state) {
  return serialize(Raw.deserialize({ nodes: state }, { terse: true }));
}

describe('RichMarkdownSerializer', () => {
  describe('Heading', () => {
    it('Heading1', () => {
      const state = [{
        "kind": "block",
        "type": "heading1",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h1 Heading", "marks": [] }] }],
        "tag": "h1",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '# h1 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Heading2', () => {
      const state = [{
        "kind": "block",
        "type": "heading2",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h2 Heading", "marks": [] }] }],
        "tag": "h2",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '## h2 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Heading3', () => {
      const state = [{
        "kind": "block",
        "type": "heading3",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h3 Heading", "marks": [] }] }],
        "tag": "h3",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '### h3 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Heading4', () => {
      const state = [{
        "kind": "block",
        "type": "heading4",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h4 Heading", "marks": [] }] }],
        "tag": "h4",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '#### h4 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Heading5', () => {
      const state = [{
        "kind": "block",
        "type": "heading5",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h5 Heading", "marks": [] }] }],
        "tag": "h5",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '##### h5 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Heading6', () => {
      const state = [{
        "kind": "block",
        "type": "heading6",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h6 Heading", "marks": [] }] }],
        "tag": "h6",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '###### h6 Heading';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Code', () => {
    it('Inline code', () => {
      const state = [
        {
          "kind": "block",
          "type": "paragraph",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Inline ", "marks": [] }, {
              "text": "code",
              "marks": [{ "type": "code", "data": { "markup": "`" } }]
            }]
          }],
          "tag": "p",
          "data": { "level": 1, "map": [3, 4] }
        }
      ];
      const markdown = 'Inline `code`';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Indented code', () => {
      const state = [
        {
          "kind": "block",
          "type": "heading3",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Indented code", "marks": [] }] }],
          "tag": "h3",
          "data": { "level": 1, "map": [6, 7] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [7, 8] },
          "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
        },
        {
          "kind": "block",
          "type": "code",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "// Some comments\nline 1 of code\nline 2 of code\nline 3 of code" }]
          }],
          "tag": "code",
          "data": { "level": 1, "map": [8, 12] }
        }
      ];
      const markdown = `### Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Block code fences', () => {
      const state = [{
        "kind": "block",
        "type": "code",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Sample text here..." }] }],
        "tag": "code",
        "data": { "markup": "```", "level": 1, "map": [16, 19] }
      }];
      const quotes = '```';
      const markdown = `${quotes}
Sample text here...
${quotes}`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    })
  });

  describe('Paragraph', () => {
    it('Paragraph', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph one.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [1, 2] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph two.", "marks": [] }] }],
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
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Paragraph three.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }];
      const markdown = `Paragraph one.

Paragraph two.

Paragraph three.`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Table', () => {
    it('Table', () => {
      const state = [{
        "kind": "block",
        "type": "table",
        "nodes": [{
          "kind": "block",
          "type": "thead",
          "nodes": [{
            "kind": "block",
            "type": "tr",
            "nodes": [{
              "kind": "block",
              "type": "th",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "First Header", "marks": [] }],
                "data": { "parent": "thead" }
              }],
              "tag": "th",
              "data": { "level": 4, "map": [0, 1], "parent": "thead" }
            }, {
              "kind": "block",
              "type": "th",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Second Header", "marks": [] }],
                "data": { "parent": "thead" }
              }],
              "tag": "th",
              "data": { "level": 4, "map": [0, 1], "parent": "thead" }
            }],
            "tag": "tr",
            "data": { "level": 3, "map": [0, 1], "parent": "thead" }
          }],
          "tag": "thead",
          "data": { "level": 2, "map": [0, 1], "parent": "table" }
        }, {
          "kind": "block",
          "type": "tbody",
          "nodes": [{
            "kind": "block",
            "type": "tr",
            "nodes": [{
              "kind": "block",
              "type": "td",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Content Cell", "marks": [] }],
                "data": { "parent": "tbody" }
              }],
              "tag": "td",
              "data": { "level": 4, "parent": "tbody" }
            }, {
              "kind": "block",
              "type": "td",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Content Cell", "marks": [] }],
                "data": { "parent": "tbody" }
              }],
              "tag": "td",
              "data": { "level": 4, "parent": "tbody" }
            }],
            "tag": "tr",
            "data": { "level": 3, "parent": "tbody" }
          }, {
            "kind": "block",
            "type": "tr",
            "nodes": [{
              "kind": "block",
              "type": "td",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Content Cell", "marks": [] }],
                "data": { "parent": "tbody" }
              }],
              "tag": "td",
              "data": { "level": 4, "parent": "tbody" }
            }, {
              "kind": "block",
              "type": "td",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Content Cell", "marks": [] }],
                "data": { "parent": "tbody" }
              }],
              "tag": "td",
              "data": { "level": 4, "parent": "tbody" }
            }],
            "tag": "tr",
            "data": { "level": 3, "parent": "tbody" }
          }],
          "tag": "tbody",
          "data": { "level": 2, "map": [2, 4], "parent": "table" }
        }],
        "tag": "table",
        "data": { "level": 1, "map": [0, 4] }
      }];
      const markdown = `| First Header | Second Header |
| --------- | --------- |
| Content Cell | Content Cell |
| Content Cell | Content Cell |`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Definition lists', () => {
    it('Compact style', () => {
      const state = [{
        "kind": "block",
        "type": "dl-simple",
        "nodes": [{
          "kind": "block",
          "type": "dt-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Term 1", "marks": [] }] }],
          "tag": "dt",
          "data": { "level": 2, "map": [4, 4] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 1", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [5, 7] }
        }, {
          "kind": "block",
          "type": "dt-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Term 2", "marks": [] }] }],
          "tag": "dt",
          "data": { "level": 2, "map": [7, 7] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 2a", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [7, 9] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 2b", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [9, 11] }
        }],
        "tag": "dl",
        "data": { "level": 1, "map": [4, 11] }
      }];
      const markdown = `Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Blockquote', () => {
    it('Blockquote', () => {
      const state = [{
        "kind": "block",
        "type": "blockquote",
        "nodes": [{
          "kind": "block",
          "type": "paragraph",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Blockquote 1", "marks": [] }],
            "data": { "parent": "blockquote" }
          }],
          "tag": "p",
          "data": { "level": 3, "map": [2, 3], "parent": "blockquote" }
        }, {
          "kind": "block",
          "type": "blockquote",
          "nodes": [{
            "kind": "block",
            "type": "paragraph",
            "nodes": [{
              "kind": "text",
              "ranges": [{ "text": "Blockquote 2", "marks": [] }],
              "data": { "parent": "blockquote" }
            }],
            "tag": "p",
            "data": { "level": 4, "map": [3, 4], "parent": "blockquote" }
          }, {
            "kind": "block",
            "type": "blockquote",
            "nodes": [{
              "kind": "block",
              "type": "paragraph",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Blockquote 3", "marks": [] }],
                "data": { "parent": "blockquote" }
              }],
              "tag": "p",
              "data": { "level": 5, "map": [4, 5], "parent": "blockquote" }
            }],
            "tag": "blockquote",
            "data": { "level": 3, "map": [4, 5], "parent": "blockquote" }
          }],
          "tag": "blockquote",
          "data": { "level": 2, "map": [3, 5], "parent": "blockquote" }
        }],
        "tag": "blockquote",
        "data": { "level": 1, "map": [2, 5] }
      }];
      const markdown = `> Blockquote 1
> > Blockquote 2
> > > Blockquote 3`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Links', () => {
    it('anchor', () => {
      const state = [{
        "kind": "block",
        "type": "anchor",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Text text text", "marks": [] }] }],
        "tag": "anchor",
        "data": { "level": 1, "map": [2, 3], "label": "label" }
      }];
      const markdown = '[^label]: Text text text';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('link', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "link text", "marks": [] }] }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '[link text](http://dev.nodeca.com)';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('link with title', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "link with title", "marks": [] }] }],
          "type": "link",
          "data": { "href": "http://nodeca.github.io/pica/demo/", "title": "title text!" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }];
      const markdown = '[link with title](http://nodeca.github.io/pica/demo/ "title text!")';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('link with emphasis', () => {
      let state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{
              "text": "link text",
              "marks": [{ "type": "strikethrough", "data": { "markup": "~~" } }, {
                "type": "italic",
                "data": { "markup": "_" }
              }, { "type": "bold", "data": { "markup": "**" } }]
            }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com", "title": "title text!" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [6, 7] }
      }];
      let markdown = '**_~~[link text](http://dev.nodeca.com "title text!")~~_**';
      let repars = reparser(state);
      expect(repars).to.equal(markdown);

      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{
              "text": "link text",
              "marks": [{ "type": "italic", "data": { "markup": "_" } }, { "type": "bold", "data": { "markup": "**" } }]
            }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [8, 9] }
      }];
      markdown = '**_[link text](http://dev.nodeca.com)_**';
      repars = reparser(state);
      expect(repars).to.equal(markdown);

      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "link text", "marks": [{ "type": "italic", "data": { "markup": "_" } }] }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [10, 11] }
      }];
      markdown = '_[link text](http://dev.nodeca.com)_';
      repars = reparser(state);
      expect(repars).to.equal(markdown);

      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "link text", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }],
        "tag": "p",
        "data": { "level": 1, "map": [12, 13] }
      }];
      markdown = '**[link text](http://dev.nodeca.com)**';
      repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Lists', () => {
    it('Unordered', () => {
      const state = [{
        "kind": "block",
        "type": "unordered-list",
        "nodes": [{
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Item a", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [2, 3], "parent": "unordered-list" }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Item b", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }, {
            "kind": "block",
            "type": "unordered-list",
            "nodes": [{
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Item b1", "marks": [] }],
                "data": { "parent": "unordered-list" }
              }],
              "tag": "li",
              "data": { "markup": "-", "level": 4, "map": [4, 5], "parent": "unordered-list" }
            }],
            "tag": "ul",
            "data": { "level": 3, "map": [4, 5], "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [3, 5], "parent": "unordered-list" }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Item c", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [5, 6], "parent": "unordered-list" }
        }],
        "tag": "ul",
        "data": { "level": 1, "map": [2, 6] }
      }];
      const markdown = `+ Item a
+ Item b
    - Item b1
+ Item c`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Ordered', () => {
      const state = [{
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
          "data": { "markup": ".", "level": 2, "map": [2, 3], "parent": "ordered-list", "itemNum": 1 }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [3, 4], "parent": "ordered-list", "itemNum": 2 }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Very easy!", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }, {
            "kind": "block",
            "type": "ordered-list",
            "nodes": [{
              "kind": "block",
              "type": "list-item",
              "nodes": [{
                "kind": "text",
                "ranges": [{ "text": "Marker character change forces new list start", "marks": [] }],
                "data": { "parent": "ordered-list" }
              }],
              "tag": "li",
              "data": { "markup": ".", "level": 4, "map": [5, 6], "parent": "ordered-list", "itemNum": 1 }
            }],
            "tag": "ol",
            "data": { "level": 3, "map": [5, 6], "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [4, 6], "parent": "ordered-list", "itemNum": 3 }
        }],
        "tag": "ol",
        "data": { "level": 1, "map": [2, 6] }
      }];
      const markdown = `1. Create a list by starting a line with
2. Sub-lists are made by indenting 2 spaces
3. Very easy!
    1. Marker character change forces new list start`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Various blocks', () => {
    it('Abbreviations', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "This is ", "marks": [] }] }, {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        }, { "kind": "text", "ranges": [{ "text": " abbreviation example.", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [3, 4] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "abbr-def",
        "nodes": [],
        "tag": "abbr-def",
        "data": { "level": 1, "map": [4, 5], "label": "PHP", "title": "Personal Home Page" },
        "isVoid": true
      }];
      const markdown = `This is PHP abbreviation example.

*[PHP]: Personal Home Page`;
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Horizontal Rules', () => {
      let state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "___", "level": 1, "map": [9, 10] },
        "isVoid": true
      }];
      let markdown = '___';
      let repars = reparser(state);
      expect(repars).to.equal(markdown);

      state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "---", "level": 1, "map": [11, 12] },
        "isVoid": true
      }];
      markdown = '---';
      repars = reparser(state);
      expect(repars).to.equal(markdown);

      state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "***", "level": 1, "map": [13, 14] },
        "isVoid": true
      }];
      markdown = '***';
      repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });

  describe('Markups', () => {
    it('bold1', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is bold text", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const markdown = '**This is bold text**';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('bold2', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is bold text", "marks": [{ "type": "bold", "data": { "markup": "__" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }];
      const markdown = '__This is bold text__';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('italic1', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is italic text", "marks": [{ "type": "italic", "data": { "markup": "*" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [6, 7] }
      }];
      const markdown = '*This is italic text*';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('italic2', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is italic text", "marks": [{ "type": "italic", "data": { "markup": "_" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [8, 9] }
      }];
      const markdown = '_This is italic text_';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Strikethrough', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Strikethrough", "marks": [{ "type": "strikethrough", "data": { "markup": "~~" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [10, 11] }
      }];
      const markdown = '~~Strikethrough~~';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Superscript', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "19", "marks": [] }, {
            "text": "th",
            "marks": [{ "type": "sup", "data": { "markup": "^" } }]
          }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [15, 16] }
      }];
      const markdown = '19^th^';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Subscript', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "H", "marks": [] }, {
            "text": "2",
            "marks": [{ "type": "sub", "data": { "markup": "~" } }]
          }, { "text": "O", "marks": [] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [17, 18] }
      }];
      const markdown = 'H~2~O';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Inserted text', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Inserted text", "marks": [{ "type": "underline", "data": { "markup": "++" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [21, 22] }
      }];
      const markdown = '++Inserted text++';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });

    it('Marked text', () => {
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Marked text", "marks": [{ "type": "mark", "data": { "markup": "==" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [26, 27] }
      }];
      const markdown = '==Marked text==';
      const repars = reparser(state);
      expect(repars).to.equal(markdown);
    });
  });
});
