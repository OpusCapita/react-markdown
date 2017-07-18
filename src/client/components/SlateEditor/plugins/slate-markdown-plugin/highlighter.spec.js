import Prism from 'prismjs';
import { grammar } from './MarkdownPreviewSchema';
import { assert } from 'chai';
import $ from 'cheerio';

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

let getHtml = (str) => Prism.highlight(str, grammar);
let escapeRegExp= function(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

describe('highlighter', () => {
  // it('should highlight blockquote', ()=> {

  // });

  // it('should highlight code', ()=> {

  // });

  it('should highlight header1', ()=> {
    let html;

    html = '# Header';
    assert.equal(getHtml(html), '<span class="token header1"># Header</span>');

    html = '#Header';
    assert.equal(getHtml(html), '#Header');
  });

  it('should highlight header2', ()=> {
    let html;

    html = '## Header';
    assert.equal(getHtml(html), '<span class="token header2">## Header</span>');

    html = '##Header';
    assert.equal(getHtml(html), '##Header');
  });

  it('should highlight header3', ()=> {
    let html;

    html = '### Header';
    assert.equal(getHtml(html), '<span class="token header3">### Header</span>');

    html = '###Header';
    assert.equal(getHtml(html), '###Header');
  });

  it('should highlight header4', ()=> {
    let html;

    html = '#### Header';
    assert.equal(getHtml(html), '<span class="token header4">#### Header</span>');

    html = '####Header';
    assert.equal(getHtml(html), '####Header');
  });

  it('should highlight header5', ()=> {
    let html;
    html = '##### Header';
    assert.equal(getHtml(html), '<span class="token header5">##### Header</span>');

    html = '#####Header';
    assert.equal(getHtml(html), '#####Header');
  });

  it('should highlight header6', ()=> {
    let html;

    html = '###### Header';
    assert.equal(getHtml(html), '<span class="token header6">###### Header</span>');

    html = '######Header';
    assert.equal(getHtml(html), '######Header');
  });

  it('should highlight hr', ()=> {
    let html;

    html = '---';
    assert.equal(getHtml(html), '<span class="token hr">---</span>');

    html = '***';
    assert.equal(getHtml(html), '<span class="token hr">***</span>');

    html = '-----';
    assert.equal(getHtml(html), '<span class="token hr">-----</span>');

    html = '*****';
    assert.equal(getHtml(html), '<span class="token hr">*****</span>');

    html = 'word-----';
    assert.equal(getHtml(html), 'word-----');

    html = 'word*****';
    assert.equal(getHtml(html), 'word*****');

    html = '-----word';
    assert.equal(getHtml(html), '-----word');

    html = '*****word';
    assert.equal(getHtml(html), '*****word');
  });

  it('should highlight list', ()=> {
    let html;

    html = '- item-1';
    assert.equal(getHtml(html), '<span class="token list">- item-1</span>');

    html = 'word - item-1';
    assert.equal(getHtml(html), 'word - item-1');

    html = '* item-1';
    assert.equal(getHtml(html), '<span class="token list">* item-1</span>');

    html = 'word * item-1';
    assert.equal(getHtml(html), 'word * item-1');

    // TODO - write more tests
  });

  // it('should highlight url', ()=> {

  // });

  it('should highlight bold', ()=> {
    let html;

    html = '__bold__';
    assert.equal(getHtml(html), '<span class="token bold">__bold__</span>');

    // html = '**bold**';
    // assert.equal(getHtml(html), '<span class="token bold">**bold**</span>');
  });

  it('should highlight italic', ()=> {
    let html;

    html = '_italic_';
    assert.equal(getHtml(html), '<span class="token italic">_italic_</span>');

    // html = '*italic*';
    // assert.equal(getHtml(html), '<span class="token italic">*italic*</span>');
  });

  it('should highlight bold-italic (underscores)', ()=> {
    let html;
    let candidate1;
    let candidate2;

    html = '___bold-italic___';

    candidate1 = escapeRegExp(
      `<span class="token bold">__<span class="token italic">_bold-italic_</span>__</span>`
    );
    candidate2 = escapeRegExp(
      `<span class="token italic">_<span class="token bold">__bold-italic__</span>_</span>`
    );

    assert.match(getHtml(html), new RegExp(`(${candidate1}|${candidate2})`));
  });

  it('should highlight bold-italic (asterisks)', ()=> {
    let html;
    let candidate1;
    let candidate2;

    html = '***bold-italic***';

    candidate1 = escapeRegExp(
      `<span class="token bold">**<span class="token italic">*bold-italic*</span>**</span>`
    );
    candidate2 = escapeRegExp(
      `<span class="token italic">*<span class="token bold">**bold-italic**</span>*</span>`
    );

    assert.match(getHtml(html), new RegExp(`(${candidate1}|${candidate2})`));
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v1', ()=> {
    let html = '_**bold-italic**_';
    let candidate = escapeRegExp(
      `<span class="token italic">_<span class="token bold">**bold-italic**</span>_</span>`
    );

    assert.match(getHtml(html), new RegExp(candidate));

  });

  it('should highlight bold-italic (underscores / asterisks mixed) v2', ()=> {
    let html = '*__bold-italic__*';
    let candidate = escapeRegExp(
      `<span class="token italic">*<span class="token bold">__bold-italic__</span>*</span>`
    );

    assert.match(getHtml(html), new RegExp(candidate));
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v3', ()=> {
    let html = '__*bold-italic*__';
    let candidate = escapeRegExp(
      `<span class="token bold">__<span class="token italic">*bold-italic*</span>__</span>`
    );

    assert.match(getHtml(html), new RegExp(candidate));
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v4', ()=> {
    let html = '**_bold-italic_**';
    let candidate = escapeRegExp(
      `<span class="token bold">**<span class="token italic">_bold-italic_</span>**</span>`
    );

    assert.match(getHtml(html), new RegExp(candidate));
  });

  // it('should highlight bold inside italic', ()=> {

  // });

  // it('should highlight strikethrough', ()=> {

  // });
});
