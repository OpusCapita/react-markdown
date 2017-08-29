/* eslint-disable max-len */

import Prism from 'prismjs';
import schema from '../schema';
import { grammar } from '../schema';
import { assert, expect } from 'chai';
import { shallow } from 'enzyme';

let getHtml = (str) => Prism.highlight(str, grammar);
let escapeRegExp = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const rendererComponent = schema.rules[0].render;

describe('plain editor schema', () => {
  describe('render component', () => {
    it('render multiline', () => {
      const props = {
        node: { type: 'multiline' },
        children: 'some text'
      };
      const result = rendererComponent(props);
      const wrapper = shallow(result);
      expect(wrapper.find('div')).to.have.length(1);
      expect(wrapper.find('div').hasClass('oc-md-hl-block')).to.equal(true);
      expect(wrapper.text()).to.equal(props.children);
    });

    it('render props without marks', () => {
      const props = {
        node: { type: 'text' },
        children: 'some text'
      };
      const result = rendererComponent(props);
      expect(result).to.be.null; // eslint-disable-line
    });

    it('render props with marks', () => {
      const props = {
        node: { type: 'text' },
        children: 'some text',
        mark: { type: 'italic' }
      };
      const result = rendererComponent(props);
      const wrapper = shallow(result);
      expect(wrapper.find('span')).to.have.length(1);
      expect(wrapper.find('span').hasClass('oc-md-hl-italic')).to.equal(true);
      expect(wrapper.text()).to.equal(props.children);
    });

    it('render props with marks', () => {
      const props = {
        node: { type: 'text' },
        children: '---',
        mark: { type: 'hr' }
      };
      const result = rendererComponent(props);
      const wrapper = shallow(result);
      expect(wrapper.find('span')).to.have.length(2);
      expect(wrapper.find('span').at(1).hasClass('oc-md-hl-hr')).to.equal(true);
      expect(wrapper.find('span').at(1).text()).to.equal(props.children);
    });
  });

  describe('schema - rules - match', () => {
    const result = schema.rules[0].match();
    expect(result).to.equal(true);
  });

  it('should highlight blockquote', () => {
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
    let html, candidate;

    html = '```code```';
    candidate = '<span class="token code">```code```</span>';
    assert.equal(getHtml(html), candidate);

    html = '````code```';
    assert.equal(getHtml(html), '````code```');

    html = '```code````';
    assert.equal(getHtml(html), '```code````');
  });

  it('should highlight code block', () => {
    let html, candidate;

    html =
`\`\`\`
code
\`\`\``;
    candidate = '<span class="token codeblock">```\ncode\n```</span>';
    assert.equal(getHtml(html), candidate);

    html =
`\`\`\`
co\`\`de
\`\`\``;
    candidate =
`\`\`\`
co\`\`de
\`\`\``;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight header1', () => {
    let html;

    html = `# Header`;
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

  it('should highlight header with no offset', () => {
    let html;

    html = ' # Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> # Header</span>');

    html = ' ## Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> ## Header</span>');

    html = ' ### Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> ### Header</span>');

    html = ' #### Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> #### Header</span>');

    html = ' ##### Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> ##### Header</span>');

    html = ' ###### Header';
    assert.equal(getHtml(html), '<span class="token header-no-offset"> ###### Header</span>');

    html = '    #Header';
    assert.equal(getHtml(html), '    #Header');

    html = ' #Header';
    assert.equal(getHtml(html), ' #Header');
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

    html = '-';
    candidate = `-`;
    assert.equal(getHtml(html), candidate);

    html = '-item';
    candidate = `-item`;
    assert.equal(getHtml(html), candidate);

    html = '- item';
    candidate = `<span class="token list">- item</span>`;
    assert.equal(getHtml(html), candidate);

    html =
`- item-1
- item-2
- item-3`;
    candidate = `<span class="token list">- item-1</span>\n<span class="token list">- item-2</span>\n<span class="token list">- item-3</span>`;

    assert.equal(getHtml(html), candidate);

    html =
      `- item-1
  - item-1-1
  - item-1-2
- item-2
  - item-1-2
- item-3`;

    candidate = '<span class="token list">- item-1</span>\n<span class="token list">  - item-1-1</span>\n<span class="token list">  - item-1-2</span>\n<span class="token list">- item-2</span>\n<span class="token list">  - item-1-2</span>\n<span class="token list">- item-3</span>';

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

  it('should highlight italic inside url text', () => {
    let html;
    let candidate;

    html = '[_opuscapita_](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token italic">_opuscapita_</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';
    assert.equal(getHtml(html), candidate);


    html = '[*opuscapita*](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token italic">*opuscapita*</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold inside url text', () => {
    let html;
    let candidate;

    html = '[__opuscapita__](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token bold">__opuscapita__</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';
    assert.equal(getHtml(html), candidate);

    html = '[**opuscapita**](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token bold">**opuscapita**</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside url text', () => {
    let html;
    let candidate;

    html = '[~~opuscapita~~](https://www.opuscapita.com/)';
    candidate = '<span class="token url"><span class="token punctuation">[</span><span class="token strikethrough">~~opuscapita~~</span><span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight url inside bold', () => {
    let html;
    let candidate;

    html = '**[opuscapita](https://www.opuscapita.com/)**';
    candidate = '<span class="token bold">**<span class="token url"><span class="token punctuation">[</span>opuscapita<span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>**</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight url inside italic', () => {
    let html;
    let candidate;

    html = '*[opuscapita](https://www.opuscapita.com/)*';
    candidate = '<span class="token italic">*<span class="token url"><span class="token punctuation">[</span>opuscapita<span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>*</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight url inside strikethrough', () => {
    let html;
    let candidate;

    html = '~~[opuscapita](https://www.opuscapita.com/)~~';
    candidate = '<span class="token strikethrough">~~<span class="token url"><span class="token punctuation">[</span>opuscapita<span class="token punctuation">]</span><span class="token punctuation">(https://www.opuscapita.com/)</span></span>~~</span>';
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

    html = '_**bold**';
    candidate = `_<span class="token bold">**bold**</span>`;
    assert.equal(getHtml(html), candidate);

    html = '**bold**_';
    candidate = `<span class="token bold">**bold**</span>_`;
    assert.equal(getHtml(html), candidate);

    html = '**bold***';
    candidate = `<span class="token bold">**bold**</span>*`;
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
    // uncompatible with markdown-it. should be:
    // candidate = '*<span class="token bold">**bold**</span>bold<span class="token bold">**bold**</span>';
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

  it('should highlight ___bold__ italic_', () => {
    let html = '___bold__ italic_';
    let candidate = '<span class="token italic">_<span class="token bold">__bold__</span> italic_</span>';
    assert.equal(getHtml(html), candidate);
  });

  // this case isn't processed
  it.skip('should highlight ___bold italic text_ bold__', () => {
    let html = '___bold italic text_ bold__';
    let candidate = '<span class="token bold">__<span class="token italic">_bold italic text_</span> bold__</span>';
    assert.equal(getHtml(html), candidate);
  });

  // this case isn't processed
  it.skip('should highlight __bold _italic text bold___', () => {
    let html = '__bold _italic text bold___';
    let candidate = '<span class="token bold">__bold <span class="token italic">_italic text bold_</span>__</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight _italic __bold___', () => {
    let html = '_italic __bold___';
    let candidate = '<span class="token italic">_italic <span class="token bold">__bold__</span>_</span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight __bold _italic_ bold__ simple __bold__', () => {
    let html = '__bold _italic_ bold__ simple __bold__';
    let candidate = '<span class="token bold">__bold <span class="token italic">_italic_</span> bold__</span> simple <span class="token bold">__bold__</span>';
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

    html = '*__bold-italic__italic*';
    candidate = `<span class="token italic">*__bold-italic__italic*</span>`;
    assert.equal(getHtml(html), candidate);

    html = '*italic__bold-italic__*';
    candidate = `<span class="token italic">*italic__bold-italic__*</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic (underscores / asterisks mixed) v7', () => {
    let html;
    let candidate;

    html = '__bold italic text_bold__';
    candidate = `<span class="token bold">__bold italic text_bold__</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough', () => {
    let html;
    let candidate;

    html = '~~strikethrough~~';
    candidate = `<span class="token strikethrough">~~strikethrough~~</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight _italic_ empty _italic_', () => {
    let html;
    let candidate;

    html = '_italic_ empty _italic_';
    candidate = `<span class="token italic">_italic_</span> empty <span class="token italic">_italic_</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight _italic __bold__ italic_', () => {
    let html;
    let candidate;

    html = '_italic __bold__ italic_';
    candidate = `<span class="token italic">_italic <span class="token bold">__bold__</span> italic_</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight _italic __bold_bold_bold__ italic_', () => {
    let html;
    let candidate;

    html = '_italic __bold_bold_bold__ italic_';
    candidate = `<span class="token italic">_italic <span class="token bold">__bold_bold_bold__</span> italic_</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should not highlight _italic \n empty italic_', () => {
    let html;
    let candidate;

    html = '_italic \n empty italic_';
    candidate = `_italic \n empty italic_`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside italic', () => {
    let html;
    let candidate;

    html = '*~~strikethrough~~*';
    candidate = `<span class="token italic">*<span class="token strikethrough">~~strikethrough~~</span>*</span>`;
    assert.equal(getHtml(html), candidate);

    html = '_~~strikethrough~~_';
    candidate = `<span class="token italic">_<span class="token strikethrough">~~strikethrough~~</span>_</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside bold', () => {
    let html;
    let candidate;

    html = '**~~strikethrough~~**';
    candidate = `<span class="token bold">**<span class="token strikethrough">~~strikethrough~~</span>**</span>`;
    assert.equal(getHtml(html), candidate);

    html = '__~~strikethrough~~__';
    candidate = `<span class="token bold">__<span class="token strikethrough">~~strikethrough~~</span>__</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside bold-italic', () => {
    let html;
    let candidate;

    html = '**_~~strikethrough~~_**';
    candidate = `<span class="token bold">**<span class="token italic">_<span class="token strikethrough">~~strikethrough~~</span>_</span>**</span>`;
    assert.equal(getHtml(html), candidate);

    html = '__*~~strikethrough~~*__';
    candidate = `<span class="token bold">__<span class="token italic">*<span class="token strikethrough">~~strikethrough~~</span>*</span>__</span>`;
    assert.equal(getHtml(html), candidate);

    html = '___~~strikethrough~~___';
    candidate = `<span class="token bold">__<span class="token italic">_<span class="token strikethrough">~~strikethrough~~</span>_</span>__</span>`;

    html = '***~~strikethrough~~***';
    candidate = `<span class="token bold">**<span class="token italic">*<span class="token strikethrough">~~strikethrough~~</span>*</span>**</span>`;
    assert.equal(getHtml(html), candidate);

    html = '*__~~strikethrough~~__*';
    candidate = `<span class="token italic">*<span class="token bold">__<span class="token strikethrough">~~strikethrough~~</span>__</span>*</span>`;
    assert.equal(getHtml(html), candidate);

    html = '_**~~strikethrough~~**_';
    candidate = `<span class="token italic">_<span class="token bold">**<span class="token strikethrough">~~strikethrough~~</span>**</span>_</span>`;
    assert.equal(getHtml(html), candidate);

    html = '_**~~~strikethrough~~**_';
    candidate = `<span class="token italic">_<span class="token bold">**~<span class="token strikethrough">~~strikethrough~~</span>**</span>_</span>`;
    assert.equal(getHtml(html), candidate);

    html = '_**~~strikethrough~~~**_';
    candidate = `<span class="token italic">_<span class="token bold">**<span class="token strikethrough">~~strikethrough~~</span>~**</span>_</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic inside strikethrough', () => {
    let html;
    let candidate;

    html = '~~_italic_~~';
    candidate = `<span class="token strikethrough">~~<span class="token italic">_italic_</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~*italic*~~';
    candidate = `<span class="token strikethrough">~~<span class="token italic">*italic*</span>~~</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold inside strikethrough', () => {
    let html;
    let candidate;

    html = '~~__bold__~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">__bold__</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~**bold**~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">**bold**</span>~~</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold-italic inside strikethrough', () => {
    let html;
    let candidate;

    html = '~~*__bold__*~~';
    candidate = `<span class="token strikethrough">~~<span class="token italic">*<span class="token bold">__bold__</span>*</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~**_bold_**~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">**<span class="token italic">_bold_</span>**</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~**_bold_**~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">**<span class="token italic">_bold_</span>**</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~__*bold*__~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">__<span class="token italic">*bold*</span>__</span>~~</span>`;
    assert.equal(getHtml(html), candidate);

    html = '~~___bold___~~';
    let candidate1 = escapeRegExp(
      `<span class="token strikethrough">~~<span class="token bold">__<span class="token italic">_bold_</span>__</span>~~</span>`
    );
    let candidate2 = escapeRegExp(
      `<span class="token strikethrough">~~<span class="token italic">_<span class="token bold">__bold__</span>_</span>~~</span>`
    );

    assert.match(getHtml(html), new RegExp(`(${candidate1}|${candidate2})`));


    html = '~~***bold***~~';
    candidate = `<span class="token strikethrough">~~<span class="token bold">**<span class="token italic">*bold*</span>**</span>~~</span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic inside header', () => {
    let html;
    let candidate;

    html = '# _text_';
    candidate = `<span class="token header1"># <span class="token italic">_text_</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '# *text*';
    candidate = `<span class="token header1"># <span class="token italic">*text*</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold inside header', () => {
    let html;
    let candidate;

    html = '# __text__';
    candidate = `<span class="token header1"># <span class="token bold">__text__</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '# **text**';
    candidate = `<span class="token header1"># <span class="token bold">**text**</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside header', () => {
    let html;
    let candidate;

    html = '# ~~text~~';
    candidate = `<span class="token header1"># <span class="token strikethrough">~~text~~</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight code inside header', () => {
    let html;
    let candidate;

    html = '# `text`';
    candidate = '<span class="token header1"># <span class="token code">`text`</span></span>';
    assert.equal(getHtml(html), candidate);

    html = '# ```text```';
    candidate = '<span class="token header1"># <span class="token code">```text```</span></span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic inside list', () => {
    let html;
    let candidate;

    html = '- _text_';
    candidate = `<span class="token list">- <span class="token italic">_text_</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '- *text*';
    candidate = `<span class="token list">- <span class="token italic">*text*</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold inside list', () => {
    let html;
    let candidate;

    html = '- __text__';
    candidate = `<span class="token list">- <span class="token bold">__text__</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '- **text**';
    candidate = `<span class="token list">- <span class="token bold">**text**</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside list', () => {
    let html;
    let candidate;

    html = '- ~~text~~';
    candidate = `<span class="token list">- <span class="token strikethrough">~~text~~</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight code inside list', () => {
    let html;
    let candidate;

    html = '- `text`';
    candidate = '<span class="token list">- <span class="token code">`text`</span></span>';
    assert.equal(getHtml(html), candidate);

    html = '- ```text```';
    candidate = '<span class="token list">- <span class="token code">```text```</span></span>';
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight italic inside blockquote', () => {
    let html;
    let candidate;

    html = '> _text_';
    candidate = `<span class="token blockquote">> <span class="token italic">_text_</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '> *text*';
    candidate = `<span class="token blockquote">> <span class="token italic">*text*</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight bold inside blockquote', () => {
    let html;
    let candidate;

    html = '> __text__';
    candidate = `<span class="token blockquote">> <span class="token bold">__text__</span></span>`;
    assert.equal(getHtml(html), candidate);

    html = '> **text**';
    candidate = `<span class="token blockquote">> <span class="token bold">**text**</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight strikethrough inside blockquote', () => {
    let html;
    let candidate;

    html = '> ~~text~~';
    candidate = `<span class="token blockquote">> <span class="token strikethrough">~~text~~</span></span>`;
    assert.equal(getHtml(html), candidate);
  });

  it('should highlight code inside blockquote', () => {
    let html;
    let candidate;

    html = '> `text`';
    candidate = '<span class="token blockquote">> <span class="token code">`text`</span></span>';
    assert.equal(getHtml(html), candidate);

    html = '> ```text```';
    candidate = '<span class="token blockquote">> <span class="token code">```text```</span></span>';
    assert.equal(getHtml(html), candidate);
  });
});
