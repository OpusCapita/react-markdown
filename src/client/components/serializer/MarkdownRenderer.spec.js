import { expect } from 'chai';
import MarkdownParser from './MarkdownParser'
import MarkdownRenderer from './MarkdownRenderer'
import { Raw } from 'slate'


function trimStr(str) {
  const arrStr = str.split('\n');
  for (let i = 0; i < arrStr.length; i++) {
    arrStr[i] = arrStr[i].trimRight();
  }

  return arrStr.join('\n');
}


describe('MarkdownRenderer', () => {
  let markdownRenderer;
  let oneQuote = '`';
  let quotes = '```';

  beforeEach(function() {
    markdownRenderer = new MarkdownRenderer();
  });

  it('Unordered list (5 levels)', () => {
    let str = `## Lists
Unordered

+ Create a list by starting a line with
+ Sub-lists are made by indenting 2 spaces:
    - Marker character change forces new list start:
        * Ac tristique libero volutpat at
        * Facilisis in pretium nisl aliquet
            + Create a list by starting a line with
                + Sub-lists are made by indenting 2 spaces:
                - Marker character change forces new list start:
    + Marker character change forces new list start:
        * Ac tristique libero volutpat at
        + Facilisis in pretium nisl aliquet
        - Nulla volutpat aliquam velit
    + Marker character change forces new list start:
        + Nulla volutpat aliquam velit
        + Nulla volutpat aliquam velit
        + Nulla volutpat aliquam velit
        + Nulla volutpat aliquam velit
+ Very easy!`;

    let repars = markdownRenderer.serialize(
      Raw.deserialize(MarkdownParser.parse(str), {terse: true})
    );

    expect(trimStr(str)).to.equal(trimStr(repars));
  });

  it('Ordered list (2 levels)', () => {
    let str = `## Lists    
Ordered

1. Create a list by starting a line with
2. Sub-lists are made by indenting 2 spaces:
    1. Marker character change forces new list start:
    2. Marker character change forces new list start:
    3. Marker character change forces new list start:
3. Very easy!
    1. Marker character change forces new list start:
    2. Marker character change forces new list start:
    3. Marker character change forces new list start:`;

    let repars = markdownRenderer.serialize(
      Raw.deserialize(MarkdownParser.parse(str), {terse: true})
    );

    expect(trimStr(str)).to.equal(trimStr(repars));
  });


  it.skip('Blockquotes', () => {
    let str = `## Blockquotes    

> Blockquotes can also be nested...
>
> Blockquotes can also be nested...
>
> Blockquotes can also be nested...
> > ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.
>
> Blockquotes can also be nested...
> > ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.`;

    let repars = markdownRenderer.serialize(
      Raw.deserialize(MarkdownParser.parse(str), {terse: true})
    );

    expect(trimStr(str)).to.equal(trimStr(repars));
  });


  describe('Code', () => {
    it('Complex code', () => {
      let str = `## Code


Inline ${oneQuote}code${oneQuote}

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code fences

${quotes}
Sample text here...
${quotes}


New line`;


      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('Inline `code`', () => {
      let str = 'Inline `code`';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('Indented code', () => {
      let str = `Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code`;

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('Block code fences', () => {
      let str = `Block code fences

${quotes}
Sample text here...
${quotes}



New line`;

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });
  });


  describe('Emphasis', () => {
    it('**bold text**', () => {
      let str = '**This is bold text**';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('__bold text__', () => {
      let str = '__This is bold text__';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('*italic text*', () => {
      let str = '*This is italic text*';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('_italic text_', () => {
      let str = '_This is italic text_';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it.skip('_**Various**_ text', () => {
      let str = '_**Blockquotes1**_ **_can_** also be _ne**ste**d..._';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('_ne**ste**d..._', () => {
      let str = '_ne**ste**d..._';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('~~Strikethrough~~', () => {
      let str = '~~Strikethrough~~';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('Superscript 19^th^', () => {
      let str = '19^th^';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('Subscript H~2~O', () => {
      let str = 'H~2~O';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('++Inserted text++', () => {
      let str = '++Inserted text++';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

    it('==Marked text==', () => {
      let str = '==Marked text==';

      let repars = markdownRenderer.serialize(
        Raw.deserialize(MarkdownParser.parse(str), {terse: true})
      );

      expect(str).to.equal(repars);
    });

  });
});
