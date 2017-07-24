/* eslint-disable max-len */

import Prism from 'prismjs';
import { grammar } from './MarkdownPreviewSchema';
import { assert } from 'chai';

let getHtml = (str) => Prism.highlight(str, grammar);
let escapeRegExp = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

describe('highlighter', () => {
  it('should highlight blockquote', () => {

        let ht =
`\`\`\`
hello world
hello world
\`\`\``;

    let html;

    html = '> quote text';
    assert.equal(getHtml(html), '<span class="token blockquote">> quote text</span>');

    html = '>> quote text';
    assert.equal(getHtml(html), '<span class="token blockquote">>> quote text</span>');

    html = 'word > quote text';
    assert.equal(getHtml(html), 'word > quote text');
  });

  it('should highlight code (single tick)', () => {
    let html;

    html = '`code`';
    assert.equal(getHtml(html), '<span class="token code">`code`</span>');

    html = '``code`';
    assert.equal(getHtml(html), '``code`');

    html = '`code``';
    assert.equal(getHtml(html), '`code``');

    html = '`+`, `-`, or `*`';
    assert.equal(getHtml(html), '<span class="token code">`+`</span>, <span class="token code">`-`</span>, or <span class="token code">`*`</span>');
  });

  it('should highlight code (tripple ticks)', () => {
    let html;

    html = '```code```';
    assert.equal(getHtml(html), '<span class="token code">```code```</span>');

    html = '````code```';
    assert.equal(getHtml(html), '````code```');

    html = '```code````';
    assert.equal(getHtml(html), '```code````');
  });

//   it('should highlight code block', ()=> {
//     let html;

//     html =
// `\`\`\`
// code
// \`\`\``;
//     assert.equal(getHtml(html), '<span class="token code">```\ncode\n```</span>');

//     html = '````code```';
//     assert.equal(getHtml(html), '`<span class="token code">```code```</span>');

//     html = '```code````';
//     assert.equal(getHtml(html), '<span class="token code">```code```</span>`');

//     html = '```````';
//     assert.equal(getHtml(html), '`<span class="token code">``````</span>');

//     html = '```````';
//     assert.equal(getHtml(html), '<span class="token code">``````</span>`');
//   });

  it('should highlight header1', () => {
    let html;

    html = '# Header';
    assert.equal(getHtml(html), '<span class="token header1"># Header</span>');

    html = '#Header';
    assert.equal(getHtml(html), '#Header');
  });

  it('should highlight header2', () => {
    let html;

    html = '## Header';
    assert.equal(getHtml(html), '<span class="token header2">## Header</span>');

    html = '##Header';
    assert.equal(getHtml(html), '##Header');
  });

  it('should highlight header3', () => {
    let html;

    html = '### Header';
    assert.equal(getHtml(html), '<span class="token header3">### Header</span>');

    html = '###Header';
    assert.equal(getHtml(html), '###Header');
  });

  it('should highlight header4', () => {
    let html;

    html = '#### Header';
    assert.equal(getHtml(html), '<span class="token header4">#### Header</span>');

    html = '####Header';
    assert.equal(getHtml(html), '####Header');
  });

  it('should highlight header5', () => {
    let html;
    html = '##### Header';
    assert.equal(getHtml(html), '<span class="token header5">##### Header</span>');

    html = '#####Header';
    assert.equal(getHtml(html), '#####Header');
  });

  it('should highlight header6', () => {
    let html;

    html = '###### Header';
    assert.equal(getHtml(html), '<span class="token header6">###### Header</span>');

    html = '######Header';
    assert.equal(getHtml(html), '######Header');
  });

  it('should highlight hr', () => {
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

    // One to three spaces indent are allowed:

    html = ' ---';
    assert.equal(getHtml(html), ' <span class="token hr">---</span>');

    html = '  ---';
    assert.equal(getHtml(html), '  <span class="token hr">---</span>');

    html = '   ---';
    assert.equal(getHtml(html), '   <span class="token hr">---</span>');

    html = ' ***';
    assert.equal(getHtml(html), ' <span class="token hr">***</span>');

    html = '  ***';
    assert.equal(getHtml(html), '  <span class="token hr">***</span>');

    html = '   ***';
    assert.equal(getHtml(html), '   <span class="token hr">***</span>');

    // Four spaces is too many:

    html = '    ---';
    assert.equal(getHtml(html), '    ---');

    html = '    ***';
    assert.equal(getHtml(html), '    ***');
  });

  it('should highlight list (single item)', () => {
    let html;

    html = '- item-1';
    assert.equal(getHtml(html), '<span class="token list">- item-1</span>');

    html = 'word - item-1';
    assert.equal(getHtml(html), 'word - item-1');

    html = '* item-1';
    assert.equal(getHtml(html), '<span class="token list">* item-1</span>');

    html = 'word * item-1';
    assert.equal(getHtml(html), 'word * item-1');
  });

  it('should highlight list (multiple items)', () => {
    let html;
    let candidate;

    html =
`- item-1
- item-2
- item-3`;
    candidate = `<span class="token list">- item-1</span><span class="token list">\n- item-2</span><span class="token list">\n- item-3</span>`;

    assert.equal(getHtml(html), candidate);

    html =
`- item-1
  - item-1-1
  - item-1-2
- item-2
  - item-1-2
- item-3`;

    candidate = '<span class="token list">- item-1</span><span class="token list">\n  - item-1-1</span><span class="token list">\n  - item-1-2</span><span class="token list">\n- item-2</span><span class="token list">\n  - item-1-2</span><span class="token list">\n- item-3</span>';

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight url', () => {
    let html;
    let candidate;

    html = '[opuscapita](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span>opuscapita<span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';

    assert.equal(getHtml(html), candidate);

    html = '[](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';

    assert.equal(getHtml(html), candidate);

    html = '[]()';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">()</span></span>';

    assert.equal(getHtml(html), candidate);

    html = '[opuscapita]()';
    candidate = '<span class="token url"><span class="token punctuation">[</span>opuscapita<span class="token punctuation">]</span><span class="token punctuation">()</span></span>';

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold (underscores)', () => {
    let html;
    let candidate;

    html = '__bold__';
    candidate = '<span class="token bold">__bold__</span>';
    assert.equal(getHtml(html), candidate);

    html = '__bold text_bold__';
    candidate = `<span class="token bold">__bold text_bold__</span>`;
    assert.equal(getHtml(html), candidate);

    html = '__bold_text bold__';
    candidate = `<span class="token bold">__bold_text bold__</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold (asterisks)', () => {
    let html;
    let candidate;

    html = '**bold**';
    candidate = '<span class="token bold">**bold**</span>';
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold';
    candidate = `<span class="token bold">**bold**</span>bold`;
    assert.equal(getHtml(html), candidate);

    html = 'bold**bold**';
    candidate = `bold<span class="token bold">**bold**</span>`;
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold**bold**';
    candidate = '<span class="token bold">**bold**</span>bold<span class="token bold">**bold**</span>';
    assert.equal(getHtml(html), candidate);

    html = '**bold bold**bold**';
    candidate = '<span class="token bold">**bold bold**</span>bold**';
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold bold**';
    candidate = '<span class="token bold">**bold**</span>bold bold**';
    assert.equal(getHtml(html), candidate);

    html = '***bold**bold bold**';
    candidate = '***bold<span class="token bold">**bold bold**</span>';
    assert.equal(getHtml(html), candidate);

    html = '***bold**bold**bold**';
    // uncompatible with Commonmark. should be:
    // candidate = '*<span class="token bold">**bold**bold**bold**</span>';
    candidate = '***bold<span class="token bold">**bold**</span>bold**';
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold bold***';
    candidate = '<span class="token bold">**bold**</span>bold bold***';
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold**bold***';
    candidate = '<span class="token bold">**bold**</span>bold<span class="token bold">**bold**</span>*';
    assert.equal(getHtml(html), candidate);

    html = '**bold**bold***bold**';
    candidate = '<span class="token bold">**bold**</span>bold***bold**';
    assert.equal(getHtml(html), candidate);

    html = '**bold***bold**bold**';
    candidate = '<span class="token bold">**bold**</span>*bold<span class="token bold">**bold**</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic (underscores)', () => {
    let html;
    let candidate;

    html = '_italic_';
    candidate = '<span class="token italic">_italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic';
    candidate = `_italic_italic`;
    assert.equal(getHtml(html), candidate);

    html = 'italic_italic_';
    candidate = `italic_italic_`;
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic_italic_';
    candidate = '<span class="token italic">_italic_italic_italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic italic_italic_';
    candidate = '<span class="token italic">_italic italic_italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic italic_';
    candidate = '<span class="token italic">_italic_italic italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '__italic_italic italic_';
    candidate = '<span class="token italic">__italic_italic italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '__italic_italic_italic_';
    candidate = '<span class="token italic">__italic_italic_italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic italic__';
    candidate = '<span class="token italic">_italic_italic italic__</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic_italic__';
    candidate = '<span class="token italic">_italic_italic_italic__</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic_italic__italic_';
    candidate = '<span class="token italic">_italic_italic__italic_</span>';
    assert.equal(getHtml(html), candidate);

    html = '_italic__italic_italic_';
    candidate = '<span class="token italic">_italic__italic_italic_</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic (asterisks)', () => {
    let html;
    let candidate;

    html = '*italic*';
    candidate = '<span class="token italic">*italic*</span>';
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic';
    candidate = `<span class="token italic">*italic*</span>italic`;
    assert.equal(getHtml(html), candidate);

    html = 'italic*italic*';
    candidate = `italic<span class="token italic">*italic*</span>`;
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic*italic*';
    candidate = '<span class="token italic">*italic*</span>italic<span class="token italic">*italic*</span>';
    assert.equal(getHtml(html), candidate);

    html = '*italic italic*italic*';
    candidate = '<span class="token italic">*italic italic*</span>italic*';
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic italic*';
    candidate = '<span class="token italic">*italic*</span>italic italic*';
    assert.equal(getHtml(html), candidate);

    html = '**italic*italic italic*';
    candidate = '**italic<span class="token italic">*italic italic*</span>';
    assert.equal(getHtml(html), candidate);

    html = '**italic*italic*italic*';
    // uncompatible with Commonmark. should be:
    // candidate = '*<span class="token italic">*italic*italic*italic*</span>';
    candidate = '**italic<span class="token italic">*italic*</span>italic*';
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic italic**';
    candidate = '<span class="token italic">*italic*</span>italic italic**';
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic*italic**';
    // uncompatible with Commonmark. should be:
    // '<span class="token italic">*italic*</span>italic*italic**';
    candidate = '<span class="token italic">*italic*</span>italic<span class="token italic">*italic*</span>*';
    assert.equal(getHtml(html), candidate);

    html = '*italic*italic**italic*';
    candidate = '<span class="token italic">*italic*</span>italic**italic*';
    assert.equal(getHtml(html), candidate);

    html = '*italic**italic*italic*';
    candidate = '<span class="token italic">*italic*</span><span class="token italic">*italic*</span>italic*';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores)', () => {
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

  it('should highlight bold-italic (asterisks)', () => {
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

  it('should highlight bold-italic (underscores / asterisks mixed) v1', () => {
    let html = '__*bold-italic*__';
    let candidate = `<span class="token bold">__<span class="token italic">*bold-italic*</span>__</span>`;

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v2', () => {
    let html = '**_bold-italic_**';
    let candidate = `<span class="token bold">**<span class="token italic">_bold-italic_</span>**</span>`;

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v3', () => {
    let html = '_**bold-italic**_';
    let candidate = `<span class="token italic">_<span class="token bold">**bold-italic**</span>_</span>`;

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v4', () => {
    let html = '*__bold-italic__*';
    let candidate = `<span class="token italic">*<span class="token bold">__bold-italic__</span>*</span>`;

    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v5', () => {
    let html;
    let candidate;

    // html = '*__bold-italic__italic*';
    // candidate = `<span class="token italic">*__bold-italic__italic*</span>`;

    // assert.equal(getHtml(html), candidate);

    html = '*italic__bold-italic__*';
    candidate = `<span class="token italic">*italic__bold-italic__*</span>`;

    assert.equal(getHtml(html), candidate);
  });

  // it('should highlight bold-italic (underscores / asterisks mixed) v7', ()=> {
  //   let html;
  //   let candidate;

  //   html = '__bold italic text_bold__';
  //   candidate = `<span class="token bold">__bold italic text_bold__</span>`;

  //   assert.equal(getHtml(html), candidate);
  // });

  // it('should highlight bold-italic (underscores / asterisks mixed) v6', ()=> {
  //   let html = '*__bold-italic__*';
  //   let candidate = `<span class="token italic">*<span class="token bold">__bold-italic__</span>italic*</span>`;

  //   assert.equal(getHtml(html), candidate);
  // });
});
