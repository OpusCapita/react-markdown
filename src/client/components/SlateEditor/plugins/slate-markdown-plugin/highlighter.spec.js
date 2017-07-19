import Prism from 'prismjs';
import { grammar } from './MarkdownPreviewSchema';
import { assert } from 'chai';

let getHtml = (str) => Prism.highlight(str, grammar);
let escapeRegExp= function(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

describe('highlighter', () => {
  it('should highlight blockquote', ()=> {
    let html;

    html = '> quote text';
    assert.equal(getHtml(html), '<span class="token blockquote">> quote text</span>');

    html = '>> quote text';
    assert.equal(getHtml(html), '<span class="token blockquote">>> quote text</span>');

    html = 'word > quote text';
    assert.equal(getHtml(html), 'word > quote text');
  });

  it('should highlight code (single tick)', ()=> {
    let html;

    html = '`code`';
    assert.equal(getHtml(html), '<span class="token code">`code`</span>');

    html = '``code`';
    assert.equal(getHtml(html), '`<span class="token code">`code`</span>');

    html = '`code``';
    assert.equal(getHtml(html), '<span class="token code">`code`</span>`');
  });

  it('should highlight code (tripple ticks)', ()=> {
    let html;

    html = '```code```';
    assert.equal(getHtml(html), '<span class="token code">```code```</span>');

    html = '````code```';
    assert.equal(getHtml(html), '`<span class="token code">```code```</span>');

    html = '```code````';
    assert.equal(getHtml(html), '<span class="token code">```code```</span>`');
  });

//   it('should highlight code block', ()=> {
//     let html;

//     html =
// `\`\`\`
// code
// \`\`\``;
//     assert.equal(getHtml(html), '<span class="token code">```code```</span>');

//     html = '````code```';
//     assert.equal(getHtml(html), '`<span class="token code">```code```</span>');

//     html = '```code````';
//     assert.equal(getHtml(html), '<span class="token code">```code```</span>`');
//   });

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

  it('should highlight list (single item)', ()=> {
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

  it('should highlight list (multiple items)', ()=> {
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

  it('should highlight url', ()=> {
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

  it('should highlight bold', ()=> {
    let html;

    html = '__bold__';
    assert.equal(getHtml(html), '<span class="token bold">__bold__</span>');

    html = '**bold**';
    assert.equal(getHtml(html), '<span class="token bold">**bold**</span>');
  });

  it('should highlight italic', ()=> {
    let html;

    html = '_italic_';
    assert.equal(getHtml(html), '<span class="token italic">_italic_</span>');

    html = '*italic*';
    assert.equal(getHtml(html), '<span class="token italic">*italic*</span>');
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

  // it('should highlight bold-italic (underscores / asterisks mixed) v2', ()=> {
  //   let html = '*__bold-italic__*';
  //   let candidate = escapeRegExp(
  //     `<span class="token italic">*<span class="token bold">__bold-italic__</span>*</span>`
  //   );

  //   assert.match(getHtml(html), new RegExp(candidate));
  // });

  // it('should highlight bold-italic (underscores / asterisks mixed) v3', ()=> {
  //   let html = '__*bold-italic*__';
  //   let candidate = escapeRegExp(
  //     `<span class="token bold">__<span class="token italic">*bold-italic*</span>__</span>`
  //   );

  //   assert.match(getHtml(html), new RegExp(candidate));
  // });

  // it('should highlight bold-italic (underscores / asterisks mixed) v4', ()=> {
  //   let html = '**_bold-italic_**';
  //   let candidate = escapeRegExp(
  //     `<span class="token bold">**<span class="token italic">_bold-italic_</span>**</span>`
  //   );

  //   assert.match(getHtml(html), new RegExp(candidate));
  // });

  //   it('should highlight bold-italic (asterisks)', ()=> {
  //   let html;
  //   let candidate1;
  //   let candidate2;

  //   html = '***bold-italic***';

  //   candidate1 = escapeRegExp(
  //     `<span class="token bold">**<span class="token italic">*bold-italic*</span>**</span>`
  //   );
  //   candidate2 = escapeRegExp(
  //     `<span class="token italic">*<span class="token bold">**bold-italic**</span>*</span>`
  //   );

  //   assert.match(getHtml(html), new RegExp(`(${candidate1}|${candidate2})`));
  // });
});
