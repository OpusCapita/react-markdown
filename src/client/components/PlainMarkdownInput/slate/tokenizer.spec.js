import { parse } from './tokenizer';
import { expect } from 'chai';

describe('plain editor tokenizer', () => {
  describe('tokenize emphasis #1', () => {
    it('empty line', () => {
      expect(parse('')).to.deep.equal([]);
    });

    it('just a text', () => {
      expect(parse('just a text')).to.deep.equal(['just a text']);
    });

    it('_~~_test2_~~', () => {
      expect(parse('_~~_test2_~~')).to.deep.equal(["_", {
        "type": "strikethrough",
        "content": ["~~", { "type": "italic", "content": ["_test2_"], "length": 7 }, "~~"],
        "length": 11
      }]);
    });

    it('~~_test2_~~_', () => {
      expect(parse('~~_test2_~~_')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", { "type": "italic", "content": ["_test2_"], "length": 7 }, "~~"],
        "length": 11
      }, "_"]);
    });

    it('~~*test2*~~*', () => {
      expect(parse('~~*test2*~~*')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", { "type": "italic", "content": ["*test2*"], "length": 7 }, "~~"],
        "length": 11
      }, "*"]);
    });

    it('*~~*test2*~~', () => {
      expect(parse('*~~*test2*~~')).to.deep.equal(["*", {
        "type": "strikethrough",
        "content": ["~~", { "type": "italic", "content": ["*test2*"], "length": 7 }, "~~"],
        "length": 11
      }]);
    });

    it('***test** (value should be bold);', () => {
      expect(parse('***test** (value should be bold);')).to.deep.equal(["*", {
        "type": "bold",
        "content": ["**test**"],
        "length": 8
      }, " (value should be bold);"]);
    });

    it('_ _**test**_ (value should be bold and italic);', () => {
      expect(parse('_ _**test**_ (value should be bold and italic);')).to.deep.equal(["_ ", {
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["**test**"], "length": 8 }, "_"],
        "length": 10
      }, " (value should be bold and italic);"]);
    });

    it('**__test__** (value should be bold);', () => {
      expect(parse('**__test__** (value should be bold);')).to.deep.equal([{
        "type": "bold",
        "content": ["**", { "type": "bold", "content": ["__test__"], "length": 8 }, "**"],
        "length": 12
      }, " (value should be bold);"]);
    });

    it('~~test1~~ testing ~~test2~~', () => {
      expect(parse('~~test1~~ testing ~~test2~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~test1~~"],
        "length": 9
      }, " testing ", { "type": "strikethrough", "content": ["~~test2~~"], "length": 9 }]);
    });
  });

  describe('tokenize emphasis #2', () => {
    it('just a text', () => {
      expect(parse('just a text')).to.deep.equal(["just a text"]);
    });

    it('**bold text**', () => {
      expect(parse('**bold text**')).to.deep.equal([{
        type: "bold", content: ["**bold text**"], length: 13
      }]);
    });

    it('***bold italic text***', () => {
      expect(parse('***bold italic text***')).to.deep.equal([{
        type: "italic",
        content: ["*", { "type": "bold", "content": ["**bold italic text**"], "length": 20 }, "*"],
        length: 22
      }]);
    });

    it('*italic* simple *italic*', () => {
      expect(parse('*italic* simple *italic*')).to.deep.equal([
        {
          type: "italic",
          content: ["*italic*"],
          length: 8
        },
        " simple ",
        {
          type: "italic",
          content: ["*italic*"],
          length: 8
        }
      ]);
    });

    it('**bold** simple **bold**', () => {
      expect(parse('**bold** simple **bold**')).to.deep.equal([
        {
          type: "bold",
          content: ["**bold**"],
          length: 8
        },
        " simple ",
        {
          type: "bold",
          content: ["**bold**"],
          length: 8
        }
      ]);
    });

    it('***bold italic text** italic*', () => {
      expect(parse('***bold italic text** italic*')).to.deep.equal([{
        "type": "italic",
        "content": [
          "*",
          {
            "type": "bold",
            "content": ["**bold italic text**"],
            "length": 20
          },
          " italic*"
        ],
        "length": 29
      }]);
    });

    it('***bold italic text* bold**', () => {
      expect(parse('***bold italic text* bold**')).to.deep.equal([{
        "type": "bold",
        "content": [
          "**",
          {
            "type": "italic", "content": ["*bold italic text*"], "length": 18
          },
          " bold**"
        ],
        "length": 27
      }]);
    });

    it('**_bold italic text_ bold**', () => {
      expect(parse('**_bold italic text_ bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**",
          {
            "type": "italic", "content": ["_bold italic text_"], "length": 18
          },
          " bold**"],
        "length": 27
      }]);
    });

    it('__*bold italic text* bold__', () => {
      expect(parse('__*bold italic text* bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__",
          {
            "type": "italic", "content": ["*bold italic text*"], "length": 18
          },
          " bold__"],
        "length": 27
      }]);
    });

    it('***italic bold* bold *italic bold***', () => {
      expect(parse('***italic bold* bold *italic bold***')).to.deep.equal([{
        "type": "bold",
        "content": ["**", {
          "type": "italic",
          "content": ["*italic bold*"],
          "length": 13
        }, " bold ", { "type": "italic", "content": ["*italic bold*"], "length": 13 }, "**"],
        "length": 36
      }]);
    });

    it('***italic bold** italic **italic bold***', () => {
      expect(parse('***italic bold** italic **italic bold***')).to.deep.equal([{
        "type": "italic",
        "content": ["*", { "type": "bold", "content": ["**italic bold**"], "length": 15 }, " italic ", {
          "type": "bold",
          "content": ["**italic bold**"],
          "length": 15
        }, "*"],
        "length": 40
      }]);
    });

    it('***italic bold*** simple ***italic bold***', () => {
      expect(parse('***italic bold*** simple ***italic bold***')).to.deep.equal([{
        "type": "italic",
        "content": ["*", { "type": "bold", "content": ["**italic bold**"], "length": 15 }, "*"],
        "length": 17
      }, " simple ", {
        "type": "italic",
        "content": ["*", { "type": "bold", "content": ["**italic bold**"], "length": 15 }, "*"],
        "length": 17
      }]);
    });

    it('*italic **bold italic** italic*', () => {
      expect(parse('*italic **bold italic** italic*')).to.deep.equal([{
        "type": "italic",
        "content": ["*italic ", { "type": "bold", "content": ["**bold italic**"], "length": 15 }, " italic*"],
        "length": 31
      }]);
    });

    it('*italic __bold italic__ italic*', () => {
      expect(parse('*italic __bold italic__ italic*')).to.deep.equal([{
        "type": "italic",
        "content": ["*italic ", { "type": "bold", "content": ["__bold italic__"], "length": 15 }, " italic*"],
        "length": 31
      }]);
    });

    it('**bold *italic bold* bold**', () => {
      expect(parse('**bold *italic bold* bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold ", { "type": "italic", "content": ["*italic bold*"], "length": 13 }, " bold**"],
        "length": 27
      }]);
    });

    it('**bold _italic bold_ bold**', () => {
      expect(parse('**bold _italic bold_ bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold ", { "type": "italic", "content": ["_italic bold_"], "length": 13 }, " bold**"],
        "length": 27
      }]);
    });
  });

  describe('tokenize emphasis #3', () => {
    it('__bold text__', () => {
      expect(parse('__bold text__')).to.deep.equal([{
        "type": "bold",
        "content": ["__bold text__"],
        "length": 13
      }]);
    });

    it('_italic text_', () => {
      expect(parse('_italic text_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic text_"],
        "length": 13
      }]);
    });

    it('___bold italic text___', () => {
      expect(parse('___bold italic text___')).to.deep.equal([{
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["__bold italic text__"], "length": 20 }, "_"],
        "length": 22
      }]);
    });

    it('_italic_ simple _italic_', () => {
      expect(parse('_italic_ simple _italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_"],
        "length": 8
      }, " simple ", { "type": "italic", "content": ["_italic_"], "length": 8 }]);
    });

    it('__bold__ simple __bold__', () => {
      expect(parse('__bold__ simple __bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__bold__"],
        "length": 8
      }, " simple ", { "type": "bold", "content": ["__bold__"], "length": 8 }]);
    });

    it('___italic bold_ bold _italic bold___', () => {
      expect(parse('___italic bold_ bold _italic bold___')).to.deep.equal([{
        "type": "bold",
        "content": ["__", {
          "type": "italic",
          "content": ["_italic bold_"],
          "length": 13
        }, " bold ", { "type": "italic", "content": ["_italic bold_"], "length": 13 }, "__"],
        "length": 36
      }]);
    });

    it('___italic bold__ italic __italic bold___', () => {
      expect(parse('___italic bold__ italic __italic bold___')).to.deep.equal([{
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["__italic bold__"], "length": 15 }, " italic ", {
          "type": "bold",
          "content": ["__italic bold__"],
          "length": 15
        }, "_"],
        "length": 40
      }]);
    });

    it('___italic bold___ simple ___italic bold___', () => {
      expect(parse('___italic bold___ simple ___italic bold___')).to.deep.equal([{
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["__italic bold__"], "length": 15 }, "_"],
        "length": 17
      }, " simple ", {
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["__italic bold__"], "length": 15 }, "_"],
        "length": 17
      }]);
    });

    it('_italic __bold italic__ italic_', () => {
      expect(parse('_italic __bold italic__ italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic ", { "type": "bold", "content": ["__bold italic__"], "length": 15 }, " italic_"],
        "length": 31
      }]);
    });

    it('_italic **bold italic** italic_', () => {
      expect(parse('_italic **bold italic** italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic ", { "type": "bold", "content": ["**bold italic**"], "length": 15 }, " italic_"],
        "length": 31
      }]);
    });

    it('__bold *italic bold* bold__', () => {
      expect(parse('__bold *italic bold* bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__bold ", { "type": "italic", "content": ["*italic bold*"], "length": 13 }, " bold__"],
        "length": 27
      }]);
    });

    it('__bold _italic bold_ bold__', () => {
      expect(parse('__bold _italic bold_ bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__bold ", { "type": "italic", "content": ["_italic bold_"], "length": 13 }, " bold__"],
        "length": 27
      }]);
    });

    it('___bold italic text__ italic_', () => {
      expect(parse('___bold italic text__ italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_", { "type": "bold", "content": ["__bold italic text__"], "length": 20 }, " italic_"],
        "length": 29
      }]);
    });

    it('___bold italic text_ bold__', () => {
      expect(parse('___bold italic text_ bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__", { "type": "italic", "content": ["_bold italic text_"], "length": 18 }, " bold__"],
        "length": 27
      }]);
    });
  });

  describe('tokenize emphasis #4', () => {
    it('~~strike-through text~~', () => {
      expect(parse('~~strike-through text~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~strike-through text~~"],
        "length": 23
      }]);
    });

    it('*~~strike-through text inside italic~~*', () => {
      expect(parse('*~~strike-through text inside italic~~*')).to.deep.equal([{
        "type": "italic",
        "content": ["*", {
          "type": "strikethrough",
          "content": ["~~strike-through text inside italic~~"],
          "length": 37
        }, "*"],
        "length": 39
      }]);
    });

    it('~~*italic inside strike-through text*~~', () => {
      expect(parse('~~*italic inside strike-through text*~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", { "type": "italic", "content": ["*italic inside strike-through text*"], "length": 35 }, "~~"],
        "length": 39
      }]);
    });

    it('**~~strike-through text inside bold~~**', () => {
      expect(parse('**~~strike-through text inside bold~~**')).to.deep.equal([{
        "type": "bold",
        "content": ["**", {
          "type": "strikethrough",
          "content": ["~~strike-through text inside bold~~"],
          "length": 35
        }, "**"],
        "length": 39
      }]);
    });

    it('~~**bold inside strike-through text**~~', () => {
      expect(parse('~~**bold inside strike-through text**~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", { "type": "bold", "content": ["**bold inside strike-through text**"], "length": 35 }, "~~"],
        "length": 39
      }]);
    });
  });

  describe('tokenize emphasis #5', () => {
    it('__bold text_bold__', () => {
      expect(parse('__bold text_bold__')).to.deep.equal([{
        "type": "bold", "content": ["__bold text_bold__"], "length": 18
      }]);
    });

    it('__bold_text bold__', () => {
      expect(parse('__bold_text bold__')).to.deep.equal([{
        "type": "bold",
        "content": ["__bold_text bold__"],
        "length": 18
      }]);
    });

    it('_**bold**', () => {
      expect(parse('_**bold**')).to.deep.equal(["_", {
        "type": "bold", "content": ["**bold**"], "length": 8
      }]);
    });

    it('**bold**_', () => {
      expect(parse('**bold**_')).to.deep.equal([{ "type": "bold", "content": ["**bold**"], "length": 8 }, "_"]);
    });

    it('**bold***', () => {
      expect(parse('**bold***')).to.deep.equal([{
        "type": "bold", "content": ["**bold**"], "length": 8
      }, "*"]);
    });

    it('**bold**bold', () => {
      expect(parse('**bold**bold')).to.deep.equal([{
        "type": "bold", "content": ["**bold**"], "length": 8
      }, "bold"]);
    });

    it('bold**bold**', () => {
      expect(parse('bold**bold**')).to.deep.equal(["bold", {
        "type": "bold", "content": ["**bold**"], "length": 8
      }]);
    });

    it('**bold**bold**bold**', () => {
      expect(parse('**bold**bold**bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, "bold", { "type": "bold", "content": ["**bold**"], "length": 8 }]);
    });

    it('**bold bold**bold**', () => {
      expect(parse('**bold bold**bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold bold**"],
        "length": 13
      }, "bold**"]);
    });

    it('**bold**bold bold**', () => {
      expect(parse('**bold**bold bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, "bold bold**"]);
    });

    it('***bold**bold bold**', () => {
      expect(parse('***bold**bold bold**')).to.deep.equal([{
        "type": "italic",
        "content": ["*", { "type": "bold", "content": ["**bold**"], "length": 8 }, "bold bold*"],
        "length": 19
      }, "*"]);
    });

    it('***bold**bold**bold**', () => {
      expect(parse('***bold**bold**bold**')).to.deep.equal([{
        "type": "italic",
        "content": ["*", { "type": "bold", "content": ["**bold**"], "length": 8 }, "bold*"],
        "length": 14
      }, { "type": "italic", "content": ["*bold*"], "length": 6 }, "*"]);
    });

    it('**bold**bold bold***', () => {
      expect(parse('**bold**bold bold***')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, "bold bold***"]);
    });

    it('**bold**bold**bold***', () => {
      expect(parse('**bold**bold**bold***')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, "bold", { "type": "bold", "content": ["**bold**"], "length": 8 }, "*"]);
    });

    it('**bold**bold***bold**', () => {
      expect(parse('**bold**bold***bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, "bold*", { "type": "bold", "content": ["**bold**"], "length": 8 }]);
    });

    it('**bold***bold**bold**', () => {
      expect(parse('**bold***bold**bold**')).to.deep.equal([{
        "type": "bold",
        "content": ["**bold**"],
        "length": 8
      }, { "type": "italic", "content": ["*bold*"], "length": 6 }, {
        "type": "italic",
        "content": ["*bold*"],
        "length": 6
      }, "*"]);
    });
  });

  describe('tokenize emphasis #6', () => {
    it('_italic_italic', () => {
      expect(parse('_italic_italic')).to.deep.equal(["_italic_italic"]);
    });

    it('italic_italic_', () => {
      expect(parse('italic_italic_')).to.deep.equal(["italic_italic_"]);
    });

    it('_italic_italic_italic_', () => {
      expect(parse('_italic_italic_italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_italic_italic_"],
        "length": 22
      }]);
    });

    it('_italic italic_italic_', () => {
      expect(parse('_italic italic_italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic italic_italic_"],
        "length": 22
      }]);
    });

    it('_italic_italic italic_', () => {
      expect(parse('_italic_italic italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_italic italic_"],
        "length": 22
      }]);
    });

    it('__italic_italic italic_', () => {
      expect(parse('__italic_italic italic_')).to.deep.equal(["_", {
        "type": "italic",
        "content": ["_italic_italic italic_"],
        "length": 22
      }]);
    });

    it('__italic_italic_italic_', () => {
      expect(parse('__italic_italic_italic_')).to.deep.equal(["_", {
        "type": "italic",
        "content": ["_italic_italic_italic_"],
        "length": 22
      }]);
    });

    it('_italic_italic italic__', () => {
      expect(parse('_italic_italic italic__')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_italic italic_"],
        "length": 22
      }, "_"]);
    });

    it('_italic_italic_italic__', () => {
      expect(parse('_italic_italic_italic__')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_italic_italic_"],
        "length": 22
      }, "_"]);
    });

    it('_italic_italic__italic_', () => {
      expect(parse('_italic_italic__italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic_italic__italic_"],
        "length": 23
      }]);
    });

    it('_italic__italic_italic_', () => {
      expect(parse('_italic__italic_italic_')).to.deep.equal([{
        "type": "italic",
        "content": ["_italic__italic_italic_"],
        "length": 23
      }]);
    });
  });

  describe('tokenize ordered lists', () => {
    it('1. first *line*', () => {
      expect(parse('1. first *line*')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["1. first ", { "type": "italic", "content": ["*line*"], "length": 6 }],
        "length": 15
      }]);
    });

    it('2. second **line**', () => {
      expect(parse('2. second **line**')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["2. second ", { "type": "bold", "content": ["**line**"], "length": 8 }],
        "length": 18
      }]);
    });

    it('3) third __*line*__', () => {
      expect(parse('3) third __*line*__')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["3) third ", {
          "type": "bold",
          "content": ["__", { "type": "italic", "content": ["*line*"], "length": 6 }, "__"],
          "length": 10
        }],
        "length": 19
      }]);
    });

    it('4) third _**~~line~~**_', () => {
      expect(parse('4) third _**~~line~~**_')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["4) third ", {
          "type": "italic",
          "content": ["_", {
            "type": "bold",
            "content": ["**", { "type": "strikethrough", "content": ["~~line~~"], "length": 8 }, "**"],
            "length": 12
          }, "_"],
          "length": 14
        }],
        "length": 23
      }]);
    });

    it('  1) first first line', () => {
      expect(parse('  1) first first line')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["  1) first first line"],
        "length": 21
      }]);
    });

    it('    1. third first first line', () => {
      expect(parse('    1. third first first line')).to.deep.equal([{
        "type": "ordered-list",
        "content": ["    1. third first first line"],
        "length": 29
      }]);
    });

    it('not lists', () => {
      expect(parse('1 item-1')).to.deep.equal(["1 item-1"]);
      expect(parse('  2 item-2')).to.deep.equal(["  2 item-2"]);
      expect(parse('    3 item-3')).to.deep.equal(["    3 item-3"]);
    });
  });

  describe('tokenize unordered lists', () => {
    it('emphasis inside list', () => {
      expect(parse('- _text_')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "italic", "content": ["_text_"], "length": 6 }],
        "length": 8
      }]);
      expect(parse('- *text*')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "italic", "content": ["*text*"], "length": 6 }],
        "length": 8
      }]);
      expect(parse('- __text__')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "bold", "content": ["__text__"], "length": 8 }],
        "length": 10
      }]);
      expect(parse('- **text**')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "bold", "content": ["**text**"], "length": 8 }],
        "length": 10
      }]);
      expect(parse('- ~~text~~')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "strikethrough", "content": ["~~text~~"], "length": 8 }],
        "length": 10
      }]);
    });

    it('inline code inside list', () => {
      expect(parse('- `text`')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "code", "content": "`text`", "length": 6 }],
        "length": 8
      }]);
      expect(parse('- ```text```')).to.deep.equal([{
        "type": "list",
        "content": ["- ", { "type": "code", "content": ["```text```"], "length": 10 }],
        "length": 12
      }]);
    });

    it('+ Create a list by starting a line with `+`, `-`, or `*`', () => {
      expect(parse('+ Create a list by starting a line with `+`, `-`, or `*`')).to.deep.equal([{
        "type": "list",
        "content": ["+ Create a list by starting a line with ", {
          "type": "code",
          "content": "`+`",
          "length": 3
        }, ", ", { "type": "code", "content": "`-`", "length": 3 }, ", or ", {
          "type": "code",
          "content": "`*`",
          "length": 3
        }],
        "length": 56
      }]);
    });

    it('+ Sub-lists are made by indenting 2 spaces:', () => {
      expect(parse('+ Sub-lists are made by indenting 2 spaces:')).to.deep.equal([{
        "type": "list",
        "content": ["+ Sub-lists are made by indenting 2 spaces:"],
        "length": 43
      }]);
    });

    it('  - Marker character change forces new list start:', () => {
      expect(parse('  - Marker character change forces new list start:')).to.deep.equal([{
        "type": "list",
        "content": ["  - Marker character change forces new list start:"],
        "length": 50
      }]);
    });

    it('    * Ac tristique libero volutpat at', () => {
      expect(parse('    * Ac tristique libero volutpat at')).to.deep.equal([{
        "type": "list",
        "content": ["    * Ac tristique libero volutpat at"],
        "length": 37
      }]);
    });

    it('    + Facilisis in pretium nisl aliquet', () => {
      expect(parse('    + Facilisis in pretium nisl aliquet')).to.deep.equal([{
        "type": "list",
        "content": ["    + Facilisis in pretium nisl aliquet"],
        "length": 39
      }]);
    });

    it('    - Nulla volutpat aliquam velit', () => {
      expect(parse('    - Nulla volutpat aliquam velit')).to.deep.equal([{
        "type": "list",
        "content": ["    - Nulla volutpat aliquam velit"],
        "length": 34
      }]);
    });

    it('not lists', () => {
      expect(parse('word - item-1')).to.deep.equal(["word - item-1"]);
      expect(parse('word * item-1')).to.deep.equal(["word * item-1"]);
    });
  });

  describe('tokenize hr', () => {
    it('---', () => {
      expect(parse('---')).to.deep.equal([{ "type": "hr", "content": "---", "length": 3 }]);
    });

    it('***', () => {
      expect(parse('***')).to.deep.equal([{ "type": "hr", "content": "***", "length": 3 }]);
    });

    it('___', () => {
      expect(parse('___')).to.deep.equal([{ "type": "hr", "content": "___", "length": 3 }]);
    });

    it('-----', () => {
      expect(parse('-----')).to.deep.equal([{ "type": "hr", "content": "-----", "length": 5 }]);
    });

    it('*****', () => {
      expect(parse('*****')).to.deep.equal([{ "type": "hr", "content": "*****", "length": 5 }]);
    });

    it(' ---', () => {
      expect(parse(' ---')).to.deep.equal([" ", { "type": "hr", "content": "---", "length": 3 }]);
    });

    it('  ---', () => {
      expect(parse('  ---')).to.deep.equal(["  ", { "type": "hr", "content": "---", "length": 3 }]);
    });

    it('   ---', () => {
      expect(parse('   ---')).to.deep.equal(["   ", { "type": "hr", "content": "---", "length": 3 }]);
    });

    it(' ***', () => {
      expect(parse(' ***')).to.deep.equal([" ", { "type": "hr", "content": "***", "length": 3 }]);
    });

    it('  ***', () => {
      expect(parse('  ***')).to.deep.equal(["  ", { "type": "hr", "content": "***", "length": 3 }]);
    });

    it('   ***', () => {
      expect(parse('   ***')).to.deep.equal(["   ", { "type": "hr", "content": "***", "length": 3 }]);
    });

    it('not hr', () => {
      expect(parse('word-----')).to.deep.equal(["word-----"]);
      expect(parse('word*****')).to.deep.equal(["word*****"]);
      expect(parse('-----word')).to.deep.equal(["-----word"]);
      expect(parse('*****word')).to.deep.equal(["*****word"]);
      expect(parse('    ---')).to.deep.equal(["    ---"]);
      expect(parse('    ***')).to.deep.equal(["    ***"]);
    });
  });

  describe('tokenize blockquotes', () => {
    it('> blockquotes', () => {
      expect(parse('> blockquotes')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> blockquotes"],
        "length": 13
      }]);
    });

    it('>> nested blockquotes', () => {
      expect(parse('>> nested blockquotes')).to.deep.equal([{
        "type": "blockquote",
        "content": [">> nested blockquotes"],
        "length": 21
      }]);
    });

    it('>>> nested blockquotes', () => {
      expect(parse('>>> nested blockquotes')).to.deep.equal([{
        "type": "blockquote",
        "content": [">>> nested blockquotes"],
        "length": 22
      }]);
    });

    it('> blockquotes **bold**', () => {
      expect(parse('> blockquotes **bold**')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> blockquotes ", { "type": "bold", "content": ["**bold**"], "length": 8 }],
        "length": 22
      }]);
    });

    it('>> nested blockquotes **bold _italic_**', () => {
      expect(parse('>> nested blockquotes **bold _italic_**')).to.deep.equal([{
        "type": "blockquote",
        "content": [">> nested blockquotes ", {
          "type": "bold",
          "content": ["**bold ", { "type": "italic", "content": ["_italic_"], "length": 8 }, "**"],
          "length": 17
        }],
        "length": 39
      }]);
    });

    it('>>> nested blockquotes ***italic bold***', () => {
      expect(parse('>>> nested blockquotes ***italic bold***')).to.deep.equal([{
        "type": "blockquote",
        "content": [">>> nested blockquotes ", {
          "type": "italic",
          "content": ["*", { "type": "bold", "content": ["**italic bold**"], "length": 15 }, "*"],
          "length": 17
        }],
        "length": 40
      }]);
    });


    it('> _text_', () => {
      expect(parse('> _text_')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "italic", "content": ["_text_"], "length": 6 }],
        "length": 8
      }]);
    });

    it('> *text*', () => {
      expect(parse('> *text*')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "italic", "content": ["*text*"], "length": 6 }],
        "length": 8
      }]);
    });

    it('> __text__', () => {
      expect(parse('> __text__')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "bold", "content": ["__text__"], "length": 8 }],
        "length": 10
      }]);
    });

    it('> **text**', () => {
      expect(parse('> **text**')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "bold", "content": ["**text**"], "length": 8 }],
        "length": 10
      }]);
    });

    it('> ~~text~~', () => {
      expect(parse('> ~~text~~')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "strikethrough", "content": ["~~text~~"], "length": 8 }],
        "length": 10
      }]);
    });

    it('> `text`', () => {
      expect(parse('> `text`')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "code", "content": "`text`", "length": 6 }],
        "length": 8
      }]);
    });

    it('> ```text```', () => {
      expect(parse('> ```text```')).to.deep.equal([{
        "type": "blockquote",
        "content": ["> ", { "type": "code", "content": ["```text```"], "length": 10 }],
        "length": 12
      }]);
    });

    it('not blockquotes "word > quote text"', () => {
      expect(parse('word > quote text')).to.deep.equal(["word > quote text"]);
    });
  });

  describe('tokenize url', () => {
    it('[opuscapita](https://www.opuscapita.com/)', () => {
      expect(parse('[opuscapita](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
          "type": "punctuation",
          "content": "]",
          "length": 1
        }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
        "length": 41
      }]);
    });

    it('**[opuscapita](https://www.opuscapita.com/)**', () => {
      expect(parse('**[opuscapita](https://www.opuscapita.com/)**')).to.deep.equal([{
        "type": "bold",
        "content": ["**", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
            "type": "punctuation",
            "content": "]",
            "length": 1
          }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
          "length": 41
        }, "**"],
        "length": 45
      }]);
    });

    it('[**opuscapita**](https://www.opuscapita.com/)', () => {
      expect(parse('[**opuscapita**](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
          "type": "bold",
          "content": ["**opuscapita**"],
          "length": 14
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 45
      }]);
    });

    it('[*[**opuscapita**](https://www.opuscapita.com/)*)', () => {
      expect(parse('*[**opuscapita**](https://www.opuscapita.com/)*')).to.deep.equal([{
        "type": "italic",
        "content": ["*", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "bold",
            "content": ["**opuscapita**"],
            "length": 14
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(https://www.opuscapita.com/)",
            "length": 29
          }],
          "length": 45
        }, "*"],
        "length": 47
      }]);
    });

    it('~~[**opuscapita**](https://www.opuscapita.com/)~~', () => {
      expect(parse('~~[**opuscapita**](https://www.opuscapita.com/)~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "bold",
            "content": ["**opuscapita**"],
            "length": 14
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(https://www.opuscapita.com/)",
            "length": 29
          }],
          "length": 45
        }, "~~"],
        "length": 49
      }]);
    });

    it('**~~[**opuscapita**](https://www.opuscapita.com/)~~', () => {
      expect(parse('**~~[**opuscapita**](https://www.opuscapita.com/)~~')).to.deep.equal(["**", {
        "type": "strikethrough",
        "content": ["~~", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "bold",
            "content": ["**opuscapita**"],
            "length": 14
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(https://www.opuscapita.com/)",
            "length": 29
          }],
          "length": 45
        }, "~~"],
        "length": 49
      }]);
    });

    it('[_opuscapita_](https://www.opuscapita.com/)', () => {
      expect(parse('[_opuscapita_](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
          "type": "italic",
          "content": ["_opuscapita_"],
          "length": 12
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 43
      }]);
    });

    it('[*opuscapita*](https://www.opuscapita.com/)', () => {
      expect(parse('[*opuscapita*](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
          "type": "italic",
          "content": ["*opuscapita*"],
          "length": 12
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 43
      }]);
    });

    it('[**opuscapita*](https://www.opuscapita.com/)', () => {
      expect(parse('[**opuscapita*](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, '*', {
          "type": "italic",
          "content": ["*opuscapita*"],
          "length": 12
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 44
      }]);
    });

    it('[__opuscapita__](https://www.opuscapita.com/)', () => {
      expect(parse('[__opuscapita__](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
          "type": "bold",
          "content": ["__opuscapita__"],
          "length": 14
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 45
      }]);
    });

    it('[~~opuscapita~~](https://www.opuscapita.com/)', () => {
      expect(parse('[~~opuscapita~~](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
          "type": "strikethrough",
          "content": ["~~opuscapita~~"],
          "length": 14
        }, { "type": "punctuation", "content": "]", "length": 1 }, {
          "type": "punctuation",
          "content": "(https://www.opuscapita.com/)",
          "length": 29
        }],
        "length": 45
      }]);
    });

    it('**[opuscapita](https://www.opuscapita.com/)**', () => {
      expect(parse('**[opuscapita](https://www.opuscapita.com/)**')).to.deep.equal([{
        "type": "bold",
        "content": ["**", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
            "type": "punctuation",
            "content": "]",
            "length": 1
          }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
          "length": 41
        }, "**"],
        "length": 45
      }]);
    });

    it('*[opuscapita](https://www.opuscapita.com/)*', () => {
      expect(parse('*[opuscapita](https://www.opuscapita.com/)*')).to.deep.equal([{
        "type": "italic",
        "content": ["*", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
            "type": "punctuation",
            "content": "]",
            "length": 1
          }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
          "length": 41
        }, "*"],
        "length": 43
      }]);
    });

    it('~~[opuscapita](https://www.opuscapita.com/)~~', () => {
      expect(parse('~~[opuscapita](https://www.opuscapita.com/)~~')).to.deep.equal([{
        "type": "strikethrough",
        "content": ["~~", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
            "type": "punctuation",
            "content": "]",
            "length": 1
          }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
          "length": 41
        }, "~~"],
        "length": 45
      }]);
    });

    it('[](https://www.opuscapita.com/)', () => {
      expect(parse('[](https://www.opuscapita.com/)')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "", {
          "type": "punctuation",
          "content": "]",
          "length": 1
        }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
        "length": 31
      }]);
    });

    it('[]()', () => {
      expect(parse('[]()')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "", {
          "type": "punctuation",
          "content": "]",
          "length": 1
        }, { "type": "punctuation", "content": "()", "length": 2 }],
        "length": 4
      }]);
    });

    it('[opuscapita]()', () => {
      expect(parse('[opuscapita]()')).to.deep.equal([{
        "type": "url",
        "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
          "type": "punctuation",
          "content": "]",
          "length": 1
        }, { "type": "punctuation", "content": "()", "length": 2 }],
        "length": 14
      }]);
    });
  });

  describe('tokenize inline code', () => {
    it('text `inline code` text', () => {
      expect(parse('text `inline code` text')).to.deep.equal(["text ", {
        "type": "code",
        "content": "`inline code`",
        "length": 13
      }, " text"]);
    });

    it('text ```inline code``` text', () => {
      expect(parse('text ```inline code``` text')).to.deep.equal(["text ", {
        "type": "code",
        "content": ["```inline code```"],
        "length": 17
      }, " text"]);
    });

    it('`inline code`', () => {
      expect(parse('`inline code`')).to.deep.equal([{
        "type": "code",
        "content": "`inline code`",
        "length": 13
      }]);
    });

    it('```inline code```', () => {
      expect(parse('```inline code```')).to.deep.equal([{
        "type": "code",
        "content": ["```inline code```"],
        "length": 17
      }]);
    });

    it('`+`, `-`, or `*`', () => {
      expect(parse('`+`, `-`, or `*`')).to.deep.equal([{
        "type": "code",
        "content": "`+`",
        "length": 3
      }, ", ", { "type": "code", "content": "`-`", "length": 3 }, ", or ", {
        "type": "code",
        "content": "`*`",
        "length": 3
      }]);
    });

    it('not inline code', () => {
      expect(parse('````code```')).to.deep.equal(["````code```"]);
      expect(parse('```code````')).to.deep.equal(["```code````"]);
      expect(parse('``code`')).to.deep.equal(["``code`"]);
      expect(parse('`code``')).to.deep.equal(["`code``"]);
    });
  });

  describe('tokenize headers', () => {
    it('simple headers', () => {
      expect(parse('# h1')).to.deep.equal([{
        "type": "header",
        "content": ["# h1"],
        "length": 4
      }]);
      expect(parse('## h2')).to.deep.equal([{
        "type": "header",
        "content": ["## h2"],
        "length": 5
      }]);
      expect(parse('### h3')).to.deep.equal([{
        "type": "header",
        "content": ["### h3"],
        "length": 6
      }]);
      expect(parse('#### h4')).to.deep.equal([{
        "type": "header",
        "content": ["#### h4"],
        "length": 7
      }]);
      expect(parse('##### h5')).to.deep.equal([{
        "type": "header",
        "content": ["##### h5"],
        "length": 8
      }]);
      expect(parse('###### h6')).to.deep.equal([{
        "type": "header",
        "content": ["###### h6"],
        "length": 9
      }]);
    });

    it('not headers', () => {
      expect(parse('#Header')).to.deep.equal(["#Header"]);
      expect(parse('##Header')).to.deep.equal(["##Header"]);
      expect(parse('###Header')).to.deep.equal(["###Header"]);
      expect(parse('####Header')).to.deep.equal(["####Header"]);
      expect(parse('#####Header')).to.deep.equal(["#####Header"]);
      expect(parse('######Header')).to.deep.equal(["######Header"]);
      expect(parse('    #Header')).to.deep.equal(["    #Header"]);
      expect(parse(' #Header')).to.deep.equal([" #Header"]);
    });

    it('header with *italic*', () => {
      expect(parse('# header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["# header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 17
      }]);
      expect(parse('# _text_')).to.deep.equal([{
        "type": "header",
        "content": ["# ", { "type": "italic", "content": ["_text_"], "length": 6 }],
        "length": 8
      }]);
      expect(parse('# *text*')).to.deep.equal([{
        "type": "header",
        "content": ["# ", { "type": "italic", "content": ["*text*"], "length": 6 }],
        "length": 8
      }]);
      expect(parse('## header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["## header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 18
      }]);
      expect(parse('### header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["### header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 19
      }]);
      expect(parse('#### header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["#### header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 20
      }]);
      expect(parse('##### header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["##### header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 21
      }]);
      expect(parse('###### header *italic*')).to.deep.equal([{
        "type": "header",
        "content": ["###### header ", { "type": "italic", "content": ["*italic*"], "length": 8 }],
        "length": 22
      }]);
    });

    it('header with **bold**', () => {
      expect(parse('# __text__')).to.deep.equal([{
        "type": "header",
        "content": ["# ", { "type": "bold", "content": ["__text__"], "length": 8 }],
        "length": 10
      }]);
      expect(parse('# **text**')).to.deep.equal([{
        "type": "header",
        "content": ["# ", { "type": "bold", "content": ["**text**"], "length": 8 }],
        "length": 10
      }]);
    });

    it('header with inline code', () => {
      expect(parse('# header `code`')).to.deep.equal([{
        "type": "header",
        "content": ["# header ", { "type": "code", "content": "`code`", "length": 6 }],
        "length": 15
      }]);
      expect(parse('## header ```code```')).to.deep.equal([{
        "type": "header",
        "content": ["## header ", { "type": "code", "content": ["```code```"], "length": 10 }],
        "length": 20
      }]);
      expect(parse('### header `code`')).to.deep.equal([{
        "type": "header",
        "content": ["### header ", { "type": "code", "content": "`code`", "length": 6 }],
        "length": 17
      }]);
      expect(parse('#### header ```code```')).to.deep.equal([{
        "type": "header",
        "content": ["#### header ", { "type": "code", "content": ["```code```"], "length": 10 }],
        "length": 22
      }]);
      expect(parse('##### header `code`')).to.deep.equal([{
        "type": "header",
        "content": ["##### header ", { "type": "code", "content": "`code`", "length": 6 }],
        "length": 19
      }]);
      expect(parse('###### header ```code```')).to.deep.equal([{
        "type": "header",
        "content": ["###### header ", { "type": "code", "content": ["```code```"], "length": 10 }],
        "length": 24
      }]);
    });

    it('header with ~~strikethrough~~', () => {
      expect(parse('# header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["# header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 26
      }]);
      expect(parse('## header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["## header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 27
      }]);
      expect(parse('### header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["### header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 28
      }]);
      expect(parse('#### header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["#### header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 29
      }]);
      expect(parse('##### header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["##### header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 30
      }]);
      expect(parse('###### header ~~strikethrough~~')).to.deep.equal([{
        "type": "header",
        "content": ["###### header ", { "type": "strikethrough", "content": ["~~strikethrough~~"], "length": 17 }],
        "length": 31
      }]);
    });

    it('header with url', () => {
      expect(parse('# header [~~url~~](uefasdfs)')).to.deep.equal([{
        "type": "header",
        "content": ["# header ", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "strikethrough",
            "content": ["~~url~~"],
            "length": 7
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(uefasdfs)",
            "length": 10
          }],
          "length": 19
        }],
        "length": 28
      }]);
      expect(parse('## header `code` **~~[**opuscapita**](https://www.opuscapita.com/)~~')).to.deep.equal([{
        "type": "header",
        "content": ["## header ", {
          "type": "code",
          "content": "`code`",
          "length": 6
        }, " **", {
          "type": "strikethrough",
          "content": ["~~", {
            "type": "url",
            "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
              "type": "bold",
              "content": ["**opuscapita**"],
              "length": 14
            }, { "type": "punctuation", "content": "]", "length": 1 }, {
              "type": "punctuation",
              "content": "(https://www.opuscapita.com/)",
              "length": 29
            }],
            "length": 45
          }, "~~"],
          "length": 49
        }],
        "length": 68
      }]);
      expect(parse('### header [*url*](uefasdfs)')).to.deep.equal([{
        "type": "header",
        "content": ["### header ", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "italic",
            "content": ["*url*"],
            "length": 5
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(uefasdfs)",
            "length": 10
          }],
          "length": 17
        }],
        "length": 28
      }]);
      expect(parse('#### header ~~[opuscapita](https://www.opuscapita.com/)~~')).to.deep.equal([{
        "type": "header",
        "content": ["#### header ", {
          "type": "strikethrough",
          "content": ["~~", {
            "type": "url",
            "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "opuscapita", {
              "type": "punctuation",
              "content": "]",
              "length": 1
            }, { "type": "punctuation", "content": "(https://www.opuscapita.com/)", "length": 29 }],
            "length": 41
          }, "~~"],
          "length": 45
        }],
        "length": 57
      }]);
      expect(parse('##### header [url](uefasdfs)')).to.deep.equal([{
        "type": "header",
        "content": ["##### header ", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, "url", {
            "type": "punctuation",
            "content": "]",
            "length": 1
          }, { "type": "punctuation", "content": "(uefasdfs)", "length": 10 }],
          "length": 15
        }],
        "length": 28
      }]);
      expect(parse('###### header [*url*](uefasdfs)')).to.deep.equal([{
        "type": "header",
        "content": ["###### header ", {
          "type": "url",
          "content": [{ "type": "punctuation", "content": "[", "length": 1 }, {
            "type": "italic",
            "content": ["*url*"],
            "length": 5
          }, { "type": "punctuation", "content": "]", "length": 1 }, {
            "type": "punctuation",
            "content": "(uefasdfs)",
            "length": 10
          }],
          "length": 17
        }],
        "length": 31
      }]);
    });
  });
});
