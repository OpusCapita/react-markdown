import { parse } from './tokenizer';
import { expect } from 'chai';

describe('plain editor tokenizer', () => {
  describe('tokenize emphasis #1', () => {
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
});
