import { expect } from 'chai';
import RichMarkdownDeserializer from './RichMarkdownDeserializer'
import RichMarkdownSerializer from './RichMarkdownSerializer'


function reparser(str, isPrint = false) {
  const options = [
    { regex: '\\$(\\w+)', id: 'term' },
    { regex: '\\#(\\w+)', id: 'product' }
  ];

  let repars = RichMarkdownSerializer.serialize(RichMarkdownDeserializer.deserialize(str, options));

  if (isPrint) {
    printData(str, repars);
  }

  return repars;
}

function trimStr(str) {
  const arrStr = str.split('\n');
  for (let i = 0; i < arrStr.length; i++) {
    arrStr[i] = arrStr[i].trimRight();
  }

  return arrStr.join('\n');
}

/**
 * Function printData is used for tests' debugging
 *
 * @param {String} str
 * @param {String} repars
 */

function printData(str, repars) {
  console.log('str:');
  console.log(str);
  console.log('----------------');
  console.log(' ');
  console.log('repars:');
  console.log(repars);
  console.log('----------------');
  console.log(' ');
}


describe('MarkdownRenderer', () => {
  let oneQuote = '`';
  let quotes = '```';

  describe('Lists', () => {
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
+ Very easy!



String




End list`;

      let repars = reparser(str);
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
    3. Marker character change forces new list start:


End list`;


      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe('Blockquotes', () => {
    it('Simple Blockquotes', () => {
      let str = `> Blockquotes can also be nested...
> > ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Complex Blockquotes', () => {
      let str = `## Blockquotes




> Blockquote 1-1
>
> Blockquote 1-2
>
> Blockquote 1-3
> > Blockquote 2-1
> >
> > Blockquote 2-2
> > > Blockquote 3-1


## Blockquotes

> Blockquote 1-1
>
> Blockquote 1-2
>
> Blockquote 1-3
> > Blockquote 2-1
> >
> > Blockquote 2-2
> > > Blockquote 3-1
>
> Blockquote 1-4
> > Blockquote 2-3
> > > Blockquote 3-2
>
> Blockquote 1-5
> > Blockquote 2-4
> > > Blockquote 3-3
> > > > Blockquote 4-1
> > > >
> > > > Blockquote 4-2
> > >
> > > Blockquote 3-4
> > >
> > > Blockquote 3-5


Blockquotes`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
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


      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Inline `code`', () => {
      let str = 'Inline `code`';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Indented code', () => {
      let str = `Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code
    
    
End code`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Block code fences', () => {
      let str = `Block code fences

${quotes}
Sample text here...
${quotes}


New line`;

      let repars = reparser(str);
      expect(str).to.equal(repars);
    });
  });


  describe('Texts', () => {
    it('Paragraphs', () => {
      let str = `Paragraph one.

Paragraph two.

Paragraph three`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Headings', () => {
      let str = `# Heading1.
## Heading 2.
### Heading 3.
#### Heading 4.
##### Heading 5.
###### Heading 6.`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Headings', () => {
      let str = `# Heading1.
## Heading 2.


### Heading 3.



#### Heading 4.





##### Heading 5.






###### Heading 6.`;

      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Repeat Headings', () => {
      let str = `# Heading1.
## Heading 2.
## Heading 2.
### Heading 3.
### Heading 3.
### Heading 3.
#### Heading 4.
#### Heading 4.
#### Heading 4.
#### Heading 4.
##### Heading 5.
##### Heading 5.
##### Heading 5.
##### Heading 5.
###### Heading 6.
###### Heading 6.
###### Heading 6.`;

      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Headings with paragraphs', () => {
      let str = `# Heading1.
## Heading 2-1.
Paragraph 1

Paragraph 2

Paragraph 3

## Heading 2-2
Paragraph 1

Paragraph 2

Paragraph 3`;

      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('1 line between Headings', () => {
      let str = `# Heading1.

Paragraph 1

Paragraph 2

Paragraph 3


# Heading1.
Paragraph 1

Paragraph 2

Paragraph 3`;

      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('1 line between Headings', () => {
      let str = `# Heading1.

Paragraph 1

Paragraph 2

Paragraph 3


# Heading1.
Paragraph 1

Paragraph 2

Paragraph 3`;

      let repars = reparser(str);
      expect(str).to.equal(repars);
    });
  });


  describe('Emphasis', () => {
    it('**bold text**', () => {
      let str = '**This is bold text**';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('__bold text__', () => {
      let str = '__This is bold text__';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('*italic text*', () => {
      let str = '*This is italic text*';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('_italic text_', () => {
      let str = '_This is italic text_';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it.skip('_**Various**_ text', () => {
      let str = '_**Blockquotes1**_ **_can_** also be _ne**ste**d..._';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('_ne**ste**d..._', () => {
      let str = '_ne**ste**d..._';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('~~Strikethrough~~', () => {
      let str = '~~Strikethrough~~';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Superscript 19^th^', () => {
      let str = '19^th^';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Subscript H~2~O', () => {
      let str = 'H~2~O';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('++Inserted text++', () => {
      let str = '++Inserted text++';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('==Marked text==', () => {
      let str = '==Marked text==';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });
  });


  describe('Autocomplete', () => {
    it('#term', () => {
      let str = 'This is text with #term. It is simple text.';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('$product', () => {
      let str = 'This is text with $product. It is simple text.';
      let repars = reparser(str);
      expect(str).to.equal(repars);
    });

    it('Complex', () => {
      let str = `This is text with $product. 

It is #simple text.

It #is simple $text.

It is simple text.

It is simple text.`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe('Tables', () => {
    it('Table', () => {
      let str = `## Tables

| First Header | Second Header | Third Header | 4th Header |
| --------- | --------- | --------- | --------- |
| Content Cell | Content Cell | Content Cell | Content Cell |
| Content Cell | Content Cell | Content Cell | Content Cell |


End tables`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe.skip('Typographic replacements', () => {
    it('Typographic replacements', () => {
      let str = `## Typographic replacements

Enable typographer option to see result.

(C) (C) (R) (R) (TM) (TM) (P) (P) +-

test... test... test... test?.. test!..

!!! ??? , -- ---`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe('Various Block Elements', () => {
    it('Horizontal Rules', () => {
      let str = `## Horizontal Rules
___

---

***

End Horizontal Rules`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it.skip('Definition lists. Compact style', () => {
      let str = `### Definition lists

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b

End Definition lists`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it.skip('Definition lists', () => {
      let str = `### Definition lists

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b

End Definition lists`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Abbreviations', () => {
      let str = `### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is PHP abbreviation example.

It converts PHP, but keep intact partial entries like xxxPHPyyy and so on.

*[PHP]: Personal Home Page


End Abbreviations`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe('Inline Elements', () => {
    it('Simple link', () => {
      let str = `[link text](http://dev.nodeca.com)`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Simple link 2', () => {
      let str = `## Links

[link text](http://dev.nodeca.com)

End Links`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Links with title', () => {
      let str = `## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

End Links`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Anchors', () => {
      let str = `## Anchor

[^label]: Text text text

End Anchor`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Simple image', () => {
      let str = `## Images

![Minion](https://octodex.github.com/images/minion.png)


End Images`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Image with title', () => {
      let str = `## Images

![Minion](https://octodex.github.com/images/minion.png)

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax


End Images`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });

    it('Images', () => {
      let str = `## Images

![Minion](https://octodex.github.com/images/minion.png)![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

End Images`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });


  describe('Complex', () => {
    it('Complex', () => {
      let str = `## Headings

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Subscript & Superscript

19^th^

H~2~O


### [Inserted text](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [Marked text](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


## Tables

| First Header | Second Header | Third Header | 4th Header |
| --------- | --------- | --------- | --------- |
| Content Cell | Content Cell | Content Cell | Content Cell |
| Content Cell | Content Cell | Content Cell | Content Cell |


## Autocomplete

This is text with $product. 

It is #simple text.

It #is simple $text.

It is simple text.

It is simple text.


## Blockquotes




> Blockquote 1-1
>
> Blockquote 1-2
>
> Blockquote 1-3
> > Blockquote 2-1
> >
> > Blockquote 2-2
> > > Blockquote 3-1


## Blockquotes

> Blockquote 1-1
>
> Blockquote 1-2
>
> Blockquote 1-3
> > Blockquote 2-1
> >
> > Blockquote 2-2
> > > Blockquote 3-1
>
> Blockquote 1-4
> > Blockquote 2-3
> > > Blockquote 3-2
>
> Blockquote 1-5
> > Blockquote 2-4
> > > Blockquote 3-3
> > > > Blockquote 4-1
> > > >
> > > > Blockquote 4-2
> > >
> > > Blockquote 3-4
> > >
> > > Blockquote 3-5

## Code
### Inline code

Inline ${oneQuote}code${oneQuote}


### Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code
    
    
### Block code fences

${quotes}
Sample text here...
${quotes}


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")


## Images

![Minion](https://octodex.github.com/images/minion.png)

![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

![Minion](https://octodex.github.com/images/minion.png)![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")


Like links, Images also have a footnote style syntax

## Lists
### Unordered

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
+ Very easy!


### Ordered

1. Create a list by starting a line with
2. Sub-lists are made by indenting 2 spaces:
    1. Marker character change forces new list start:
    2. Marker character change forces new list start:
    3. Marker character change forces new list start:
3. Very easy!
    1. Marker character change forces new list start:
    2. Marker character change forces new list start:
    3. Marker character change forces new list start:


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is PHP abbreviation example.

It converts PHP, but keep intact partial entries like xxxPHPyyy and so on.

*[PHP]: Personal Home Page


## Anchor

[^label]: Text text text

it is text.


End text`;
      let repars = reparser(str);
      expect(trimStr(str)).to.equal(trimStr(repars));
    });
  });
});
