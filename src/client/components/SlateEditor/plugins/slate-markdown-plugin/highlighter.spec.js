import Prism from 'prismjs';
import { grammar } from './MarkdownPreviewSchema';
import { assert } from 'chai';

let allTypesEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.every(token => token.type === type);
};

let allTypesNotEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.every(token => token.type !== type);
};

let typeEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.some(token => token.type === type);
};

let typeNotEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.every(token => token.type !== type);
};

describe('highlighter', () => {
  // it('should highlight blockquote', ()=> {

  // });

  // it('should highlight code', ()=> {

  // });

  it('should highlight header1', ()=> {
    assert.isTrue(typeEqual('header1', '# Header header header', grammar));
    assert.isTrue(typeNotEqual('header1', '#Header header header', grammar));
  });

  it('should highlight header2', ()=> {
    assert.isTrue(typeEqual('header2', '## Header header header', grammar));
    assert.isTrue(typeNotEqual('header2', '##Header header header', grammar));
  });

  it('should highlight header3', ()=> {
    assert.isTrue(typeEqual('header3', '### Header header header', grammar));
    assert.isTrue(typeNotEqual('header3', '###Header header header', grammar));
  });

  it('should highlight header4', ()=> {
    assert.isTrue(typeEqual('header4', '#### Header header header', grammar));
    assert.isTrue(typeNotEqual('header4', '####Header header header', grammar));
  });

  it('should highlight header5', ()=> {
    assert.isTrue(typeEqual('header5', '##### Header header header', grammar));
    assert.isTrue(typeNotEqual('header5', '#####Header header header', grammar));
  });

  it('should highlight header6', ()=> {
    assert.isTrue(typeEqual('header6', '###### Header header header', grammar));
    assert.isTrue(typeNotEqual('header6', '######Header header header', grammar));
  });

  it('should highlight hr', ()=> {
    assert.isTrue(typeEqual(
      'hr',
      `
      ***
      some text
      `,
      grammar
    ));

    assert.isTrue(typeEqual(
      'hr',
      `
      some text
      ***
      `,
      grammar
    ));

    assert.isTrue(typeEqual(
      'hr',
      `
      some text
      ***
      some text
      `,
      grammar
    ));

    assert.isTrue(typeEqual(
      'hr',
      `
      ---
      some text
      `,
      grammar
    ));

    assert.isTrue(typeEqual(
      'hr',
      `
      some text
      ---
      `,
      grammar
    ));

    assert.isTrue(typeEqual(
      'hr',
      `
      some text
      ---
      some text
      `,
      grammar
    ));

    assert.isTrue(typeNotEqual('hr', 'some text *** some text', grammar));
    assert.isTrue(typeNotEqual('hr', 'some text --- some text', grammar));
  });

  it('should highlight list', ()=> {
    assert.isTrue(typeNotEqual('hr', '- asdf', grammar));
    assert.isTrue(typeNotEqual('hr', 'some text - some tesxt', grammar));
  });

  // it('should highlight url', ()=> {

  // });

  it('should highlight bold', ()=> {
    let str = '__bold__';
    let tokens = Prism.tokenize(str, grammar);
    assert.equal(tokens[0].type, 'bold');

    // let str2 = '**bold**';
    // let tokens2 = Prism.tokenize(str, grammar);
    // assert.equal(tokens2[0].type, 'bold');
  });

  it('should highlight italic', ()=> {
    let str = '_italic_';
    let tokens = Prism.tokenize(str, grammar);
    assert.equal(tokens[0].type, 'italic');

    // let str2 = '*italic*';
    // let tokens2 = Prism.tokenize(str2, grammar);
    // assert.equal(tokens2[0].type, 'italic');
  });

  it('should highlight bold-italic', ()=> {
    let str = '___bold-italic___';
    let tokens = Prism.tokenize(str, grammar);

    assert.equal(tokens[0].type, 'bold');
    assert.equal(tokens[0].content[0].type, 'italic');

    // let str2 = '***bold-italic***';
    // let tokens2 = Prism.tokenize(str2, grammar);

    // assert.equal(tokens2[0].type, 'bold');
    // assert.equal(tokens2[0].content[0].type, 'italic');
  });

  it('should highlight bold inside italic', ()=> {
    let str = '___bold-italic__ italic_';
    let tokens = Prism.tokenize(str, grammar);

    assert.equal(tokens[0].content[1], ' italic_');
    assert.equal(tokens[0].content[0].content, '___bold-italic__');
    assert.equal(tokens[0].type, 'italic');
    assert.equal(tokens[0].content[0].type, 'bold');
  });

  // it('should highlight strikethrough', ()=> {

  // });
});
