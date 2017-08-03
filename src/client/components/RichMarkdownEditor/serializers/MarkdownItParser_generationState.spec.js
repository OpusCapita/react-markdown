import { expect } from 'chai';
import MarkdownItParser from './MarkdownItParser';
import MarkdownIt from '../../../markdown-it/index';

function parse(markdown) {
  const markdownItParser = new MarkdownItParser([]);
  markdownItParser.init();

  return markdownItParser.parse(MarkdownIt.parse(markdown, {}));
}

function compareJSONValues(value1, value2) {
  expect(JSON.parse(JSON.stringify(value1))).to.deep.equal(value2);
}

describe('MarkdownItParser_generationState', () => {
  describe('Heading', () => {
    it('Heading1', () => {
      const state = [{
        "kind": "block",
        "type": "heading1",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h1 Heading", "marks": [] }] }],
        "tag": "h1",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '# h1 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Heading2', () => {
      const state = [{
        "kind": "block",
        "type": "heading2",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h2 Heading", "marks": [] }] }],
        "tag": "h2",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '## h2 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Heading3', () => {
      const state = [{
        "kind": "block",
        "type": "heading3",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h3 Heading", "marks": [] }] }],
        "tag": "h3",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '### h3 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Heading4', () => {
      const state = [{
        "kind": "block",
        "type": "heading4",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h4 Heading", "marks": [] }] }],
        "tag": "h4",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '#### h4 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Heading5', () => {
      const state = [{
        "kind": "block",
        "type": "heading5",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h5 Heading", "marks": [] }] }],
        "tag": "h5",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '##### h5 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Heading6', () => {
      const state = [{
        "kind": "block",
        "type": "heading6",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "h6 Heading", "marks": [] }] }],
        "tag": "h6",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const markdown = '###### h6 Heading';
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Code', () => {
    it('Inline code', () => {
      const markdown = 'Inline `code`';
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
          "data": { "level": 1, "map": [0, 1] }
        }
      ];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Indented code', () => {
      const markdown = `### Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code`;
      const state = [
        {
          "kind": "block",
          "type": "heading3",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Indented code", "marks": [] }] }],
          "tag": "h3",
          "data": { "level": 1, "map": [0, 1] }
        },
        {
          "kind": "block",
          "type": "paragraph",
          "data": { "map": [1, 2] },
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
          "data": { "level": 1, "map": [2, 6] }
        }
      ];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Block code fences', () => {
      const quotes = '```';
      const markdown = `${quotes}
Sample text here...
${quotes}`;
      const state = [{
        "kind": "block",
        "type": "code",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Sample text here...\n" }] }],
        "tag": "code",
        "data": { "markup": "```", "level": 1, "map": [0, 3] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    })
  });

  describe('Paragraph', () => {
    it('Paragraph', () => {
      const markdown = `Paragraph one.

Paragraph two.

Paragraph three.`;
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
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Table', () => {
    it('Table', () => {
      const markdown = `| First Header | Second Header |
| --------- | --------- |
| Content Cell | Content Cell |
| Content Cell | Content Cell |`;
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
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Definition lists', () => {
    it('Compact style', () => {
      const markdown = `Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b`;
      const state = [{
        "kind": "block",
        "type": "dl-simple",
        "nodes": [{
          "kind": "block",
          "type": "dt-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Term 1", "marks": [] }] }],
          "tag": "dt",
          "data": { "level": 2, "map": [0, 0] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 1", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [1, 3] }
        }, {
          "kind": "block",
          "type": "dt-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Term 2", "marks": [] }] }],
          "tag": "dt",
          "data": { "level": 2, "map": [3, 3] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 2a", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [3, 5] }
        }, {
          "kind": "block",
          "type": "dd-simple",
          "nodes": [{ "kind": "text", "ranges": [{ "text": "Definition 2b", "marks": [] }] }],
          "tag": "dd",
          "data": { "level": 2, "map": [5, 6] }
        }],
        "tag": "dl",
        "data": { "level": 1, "map": [0, 6] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Blockquote', () => {
    const markdown = `> Blockquote 1
> > Blockquote 2
> > > Blockquote 3`;
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
          "data": { "level": 3, "map": [0, 1], "parent": "blockquote" }
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
            "data": { "level": 4, "map": [1, 2], "parent": "blockquote" }
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
              "data": { "level": 5, "map": [2, 3], "parent": "blockquote" }
            }],
            "tag": "blockquote",
            "data": { "level": 3, "map": [2, 3], "parent": "blockquote" }
          }],
          "tag": "blockquote",
          "data": { "level": 2, "map": [1, 3], "parent": "blockquote" }
        }],
        "tag": "blockquote",
        "data": { "level": 1, "map": [0, 3] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Links', () => {
    it('anchor', () => {
      const markdown = '[^label]: Text text text';
      const state = [{
        "kind": "block",
        "type": "anchor",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Text text text", "marks": [] }] }],
        "tag": "anchor",
        "data": { "level": 1, "map": [0, 1], "label": "label" }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('link', () => {
      const markdown = '[link text](http://dev.nodeca.com)';
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
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('link with title', () => {
      const markdown = '[link with title](http://nodeca.github.io/pica/demo/ "title text!")';
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
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('link with emphasis', () => {
      let markdown = '~~_**[link text](http://dev.nodeca.com "title text!")**_~~';
      let state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{
            "text": "",
            "marks": [{ "type": "strikethrough", "data": { "markup": "~~" } }, {
              "type": "italic",
              "data": { "markup": "_" }
            }, { "type": "bold", "data": { "markup": "**" } }]
          }]
        }, {
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
        }, {
          "kind": "text",
          "ranges": [{
            "text": "",
            "marks": [{ "type": "strikethrough", "data": { "markup": "~~" } }, {
              "type": "italic",
              "data": { "markup": "_" }
            }, { "type": "bold", "data": { "markup": "**" } }]
          }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      let repars = parse(markdown);
      compareJSONValues(repars, state);

      markdown = '_**[link text](http://dev.nodeca.com)**_';
      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{
            "text": "",
            "marks": [{ "type": "italic", "data": { "markup": "_" } }, { "type": "bold", "data": { "markup": "**" } }]
          }]
        }, {
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
        }, {
          "kind": "text",
          "ranges": [{
            "text": "",
            "marks": [{ "type": "italic", "data": { "markup": "_" } }, { "type": "bold", "data": { "markup": "**" } }]
          }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      repars = parse(markdown);
      compareJSONValues(repars, state);

      markdown = '_[link text](http://dev.nodeca.com)_';
      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [] }, {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "link text", "marks": [{ "type": "italic", "data": { "markup": "_" } }] }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }, { "kind": "text", "ranges": [] }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      repars = parse(markdown);
      compareJSONValues(repars, state);

      markdown = '**[link text](http://dev.nodeca.com)**';
      state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }]
        }, {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "link text", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }]
          }],
          "type": "link",
          "data": { "href": "http://dev.nodeca.com" }
        }, { "kind": "text", "ranges": [{ "text": "", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Lists', () => {
    it('Unordered', () => {
      const markdown = `+ Item a
+ Item b
    - Item b1
+ Item c`;
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
          "data": { "markup": "+", "level": 2, "map": [0, 1], "parent": "unordered-list" }
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
              "data": { "markup": "-", "level": 4, "map": [2, 3], "parent": "unordered-list" }
            }],
            "tag": "ul",
            "data": { "level": 3, "map": [2, 3], "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [1, 3], "parent": "unordered-list" }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Item c", "marks": [] }],
            "data": { "parent": "unordered-list" }
          }],
          "tag": "li",
          "data": { "markup": "+", "level": 2, "map": [3, 4], "parent": "unordered-list" }
        }],
        "tag": "ul",
        "data": { "level": 1, "map": [0, 4] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Ordered', () => {
      const markdown = `1. Create a list by starting a line with
2. Sub-lists are made by indenting 2 spaces
3. Very easy!
    1. Marker character change forces new list start`;
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
          "data": { "markup": ".", "level": 2, "map": [0, 1], "parent": "ordered-list", "itemNum": 1 }
        }, {
          "kind": "block",
          "type": "list-item",
          "nodes": [{
            "kind": "text",
            "ranges": [{ "text": "Sub-lists are made by indenting 2 spaces", "marks": [] }],
            "data": { "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [1, 2], "parent": "ordered-list", "itemNum": 2 }
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
              "data": { "markup": ".", "level": 4, "map": [3, 4], "parent": "ordered-list", "itemNum": 1 }
            }],
            "tag": "ol",
            "data": { "level": 3, "map": [3, 4], "parent": "ordered-list" }
          }],
          "tag": "li",
          "data": { "markup": ".", "level": 2, "map": [2, 4], "parent": "ordered-list", "itemNum": 3 }
        }],
        "tag": "ol",
        "data": { "level": 1, "map": [0, 4] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Various blocks', () => {
    it('Abbreviations', () => {
      const markdown = `This is PHP abbreviation example.

*[PHP]: Personal Home Page`;
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
        "data": { "level": 1, "map": [0, 1] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [1, 2] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "abbr-def",
        "nodes": [],
        "tag": "abbr-def",
        "data": { "level": 1, "map": [2, 3], "label": "PHP", "title": "Personal Home Page" },
        "isVoid": true
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Abbreviations 2', () => {
      const markdown = `This is PHP abbreviation example.

It converts PHP, but keep intact partial entries like xxxPHPyyy and so on.

*[PHP]: Personal Home Page

*[PHP]: Personal Home Page1`;
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
        "data": { "level": 1, "map": [0, 1] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [1, 2] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "It converts ", "marks": [] }] }, {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        }, {
          "kind": "text",
          "ranges": [{ "text": ", but keep intact partial entries like xxxPHPyyy and so on.", "marks": [] }]
        }],
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
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [7, 8] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Abbreviations. Empty title or empty label', () => {
      const markdown = `This is PHP abbreviation example.

*[PHP]:

*[]:`;
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "This is PHP abbreviation example.", "marks": [] }] }],
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
        "nodes": [{ "kind": "text", "ranges": [{ "text": "*[PHP]:", "marks": [] }] }],
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
        "nodes": [{ "kind": "text", "ranges": [{ "text": "*[]:", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [4, 5] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Abbreviations 4', () => {
      const markdown = `This is PHP abbreviation example.

*[`;
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{ "kind": "text", "ranges": [{ "text": "This is PHP abbreviation example.", "marks": [] }] }],
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
        "nodes": [{ "kind": "text", "ranges": [{ "text": "*[", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [2, 3] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Abbreviations 5', () => {
      const markdown = `PHP have classes

Today I don't use PHP

*[PHP]: Personal Home Page`;
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        }, { "kind": "text", "ranges": [{ "text": " have classes", "marks": [] }] }],
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
        "nodes": [{ "kind": "text", "ranges": [{ "text": "Today I don't use ", "marks": [] }] }, {
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        }],
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
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Abbreviations 6', () => {
      const markdown = `PHP have classes

*[PHP]: Personal Home Page

*[PHP1]: Personal Home Page`;
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "inline",
          "isVoid": false,
          "nodes": [{ "kind": "text", "ranges": [{ "text": "PHP" }] }],
          "type": "abbr",
          "data": { "title": "Personal Home Page" }
        }, { "kind": "text", "ranges": [{ "text": " have classes", "marks": [] }] }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }, {
        "kind": "block",
        "type": "paragraph",
        "data": { "map": [1, 2] },
        "nodes": [{ "kind": "text", "ranges": [{ "text": "" }] }]
      }, {
        "kind": "block",
        "type": "abbr-def",
        "nodes": [],
        "tag": "abbr-def",
        "data": { "level": 1, "map": [2, 3], "label": "PHP", "title": "Personal Home Page" },
        "isVoid": true
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
        "data": { "level": 1, "map": [4, 5], "label": "PHP1", "title": "Personal Home Page" },
        "isVoid": true
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Horizontal Rules', () => {
      let markdown = '___';
      let state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "___", "level": 1, "map": [0, 1] },
        "isVoid": true
      }];
      let repars = parse(markdown);
      compareJSONValues(repars, state);

      markdown = '---';
      state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "---", "level": 1, "map": [0, 1] },
        "isVoid": true
      }];
      repars = parse(markdown);
      compareJSONValues(repars, state);

      markdown = '***';
      state = [{
        "kind": "block",
        "type": "horizontal-rule",
        "nodes": [],
        "tag": "hr",
        "data": { "markup": "***", "level": 1, "map": [0, 1] },
        "isVoid": true
      }];
      repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });

  describe('Markups', () => {
    it('bold1', () => {
      const markdown = '**This is bold text**';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is bold text", "marks": [{ "type": "bold", "data": { "markup": "**" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('bold2', () => {
      const markdown = '__This is bold text__';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is bold text", "marks": [{ "type": "bold", "data": { "markup": "__" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('italic1', () => {
      const markdown = '*This is italic text*';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is italic text", "marks": [{ "type": "italic", "data": { "markup": "*" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('italic2', () => {
      const markdown = '_This is italic text_';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "This is italic text", "marks": [{ "type": "italic", "data": { "markup": "_" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Strikethrough', () => {
      const markdown = '~~Strikethrough~~';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Strikethrough", "marks": [{ "type": "strikethrough", "data": { "markup": "~~" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Superscript', () => {
      const markdown = '19^th^';
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
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Subscript', () => {
      const markdown = 'H~2~O';
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
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Inserted text', () => {
      const markdown = '++Inserted text++';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Inserted text", "marks": [{ "type": "underline", "data": { "markup": "++" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });

    it('Marked text', () => {
      const markdown = '==Marked text==';
      const state = [{
        "kind": "block",
        "type": "paragraph",
        "nodes": [{
          "kind": "text",
          "ranges": [{ "text": "Marked text", "marks": [{ "type": "mark", "data": { "markup": "==" } }] }]
        }],
        "tag": "p",
        "data": { "level": 1, "map": [0, 1] }
      }];
      const repars = parse(markdown);
      compareJSONValues(repars, state);
    });
  });
});
