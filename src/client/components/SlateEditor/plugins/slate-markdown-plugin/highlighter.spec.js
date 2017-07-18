import Prism from 'prismjs';
import { grammar } from './MarkdownPreviewSchema';
import { assert } from 'chai';

let typeEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.some(token => token.type === type);
};

let typeNotEqual = (type, str, grammar) => {
  let tokens = Prism.tokenize(str, grammar);
  return tokens.every(token => token.type !== type);
};

describe('highlighter', () => {
  it('should highlight blockquote', ()=> {

  });

  it('should highlight code', ()=> {

  });

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

  });

  it('should highlight url', ()=> {

  });

  it('should highlight bold', ()=> {

  });

  it('should highlight italic', ()=> {

  });

  it('should highlight strikethrough', ()=> {

  });
});
