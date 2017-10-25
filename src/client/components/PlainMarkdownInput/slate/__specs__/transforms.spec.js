/* eslint-disable max-len */

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Plain from 'slate-plain-serializer';
import PlainMarkdownInput from '../../PlainMarkdownInput.react';
import {
  hasAccent,
  wrapAccent,
  unwrapAccent,
  hasHeader,
  wrapHeader,
  unwrapHeader,
  wrapLinkMarkdown,
  hasMultiLineSelection
} from '../transforms';

describe('plain editor transform', () => {
  describe('Has Lists', () => {
    it('Unordered', () => {
      const nodeText = '* List item 1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(true);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);

      wrapper.setProps({ value: '  * List Item 2' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '    * List Item 3 ' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '+ List Item 1' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '  + List Item 2' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '    + List Item 3' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '- List Item 1' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '  - List Item 2' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);

      wrapper.setProps({ value: '    - List Item 3' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ul')).to.equal(true);
    });

    it('Ordered', () => {
      const nodeText = '1. List item 1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(true);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);

      wrapper.setProps({ value: '  2. List Item 2' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ol')).to.equal(true);

      wrapper.setProps({ value: '    3. List Item 3' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ol')).to.equal(true);

      wrapper.setProps({ value: '1) List Item 1' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ol')).to.equal(true);

      wrapper.setProps({ value: '  2) List Item 2' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ol')).to.equal(true);

      wrapper.setProps({ value: '    3) List Item 3' });
      editorState = wrapper.state('editorState');
      expect(hasAccent(editorState, 'ol')).to.equal(true);
    });
  });

  describe('Has Headers', () => {
    it('# Header1', () => {
      const nodeText = '# Header1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(true);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('## Header2', () => {
      const nodeText = '## Header2';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(true);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('### Header3', () => {
      const nodeText = '### Header3';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(true);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('#### Header4', () => {
      const nodeText = '#### Header4';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(true);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('##### Header5', () => {
      const nodeText = '##### Header5';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(true);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('###### Header6', () => {
      const nodeText = '###### Header6';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(true);
    });
  });

  describe('Has accent', () => {
    it('just a text', () => {
      const nodeText = 'just a text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');

      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(nodeText.length, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(false);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
    });

    it('_italic_', () => {
      const nodeText = '_italic_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
    });

    it('**bold**', () => {
      const nodeText = '**bold**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'bold')).to.equal(true);
    });

    it('~~strikethrough~~', () => {
      const nodeText = '~~strikethrough~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });

    it('_**bold italic**_', () => {
      const nodeText = '_**bold italic**_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);
    });

    it('**_bold italic_**', () => {
      const nodeText = '**_bold italic_**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);
    });

    it('_~~strikethrough italic~~_', () => {
      const nodeText = '_~~strikethrough italic~~_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });

    it('~~_strikethrough italic_~~', () => {
      const nodeText = '~~_strikethrough italic_~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });

    it('**~~strikethrough bold~~**', () => {
      const nodeText = '**~~strikethrough bold~~**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(4, nodeText.length - 4);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });

    it('~~**strikethrough bold**~~', () => {
      const nodeText = '~~**strikethrough bold**~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(4, nodeText.length - 4);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });

    it('_~~**italic strikethrough bold**~~_', () => {
      const nodeText = '_~~**italic strikethrough bold**~~_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(5, nodeText.length - 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(7, 7);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);
    });
  });

  describe('nonexistent accents or levels', () => {
    it('hasAccent', () => {
      const nodeText = '_italic text_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let result = hasAccent(change.state, 'italic');
      expect(result).to.equal(true);
      result = hasAccent(change.state, 'italic_new');
      expect(result).to.equal(false);
    });

    it('hasHeader', () => {
      const nodeText = '## Header';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let result = hasHeader(change.state, 2);
      expect(result).to.equal(true);
      result = hasHeader(change.state, 25);
      expect(result).to.equal(false);
    });

    it('wrapAccent', () => {
      const nodeText = 'simple text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = wrapAccent(change.state, 'bold_new');
      expect(Plain.serialize(newState)).to.equal(nodeText);
    });

    it('wrapHeader', () => {
      const nodeText = 'simple text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = wrapHeader(change.state, 10);
      expect(Plain.serialize(newState)).to.equal(nodeText);
    });

    it('unwrapAccent', () => {
      const nodeText = '**simple text**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 1);
      let newState = unwrapAccent(change.state, 'bold_new');
      expect(Plain.serialize(newState)).to.equal(nodeText);
    });

    it('unwrapHeader', () => {
      const nodeText = '# Header 1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      let newState = unwrapHeader(change.state, 10);
      expect(Plain.serialize(newState)).to.equal(nodeText);
    });
  });

  describe('multiline selection', () => {
    it('Has multiline selection', () => {
      const nodeText = 'some **text**\nnext line';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.selectAll();
      expect(hasMultiLineSelection(change.state)).to.equal(true);

      change.moveOffsetsTo('some'.length, 'some **text**\n'.length);
      expect(hasMultiLineSelection(change.state)).to.equal(true);

      change.moveOffsetsTo('some **text**'.length, 'some **text**\n'.length);
      expect(hasMultiLineSelection(change.state)).to.equal(true);
    });

    it('Has not multiline selection', () => {
      const nodeText = 'some **text**\nnext line';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo('some'.length, 'some **text**'.length);
      expect(hasMultiLineSelection(change.state)).to.equal(false);

      change.moveOffsetsTo('some **text**\n'.length, 'some **text**\nnext line'.length);
      expect(hasMultiLineSelection(change.state)).to.equal(false);
    });
  });

  describe('Wrap accents', () => {
    it('Wrap bold', () => {
      const nodeText = 'bold text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(5, 5);
      let newState = wrapAccent(change.state, 'bold');
      expect(Plain.serialize(newState)).to.equal('bold ****text');

      change.moveOffsetsTo(0, 'bold'.length);
      newState = wrapAccent(change.state, 'bold');
      expect(Plain.serialize(newState)).to.equal('**bold** text');

      change.moveOffsetsTo(0, 'bold text'.length);
      newState = wrapAccent(change.state, 'bold');
      expect(Plain.serialize(newState)).to.equal('**bold text**');
    });

    it('Wrap italic', () => {
      const nodeText = 'italic text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(7, 7);
      let newState = wrapAccent(change.state, 'italic');
      expect(Plain.serialize(newState)).to.equal('italic __text');

      change.moveOffsetsTo(0, 'italic'.length);
      newState = wrapAccent(change.state, 'italic');
      expect(Plain.serialize(newState)).to.equal('_italic_ text');

      change.moveOffsetsTo(0, 'italic text'.length);
      newState = wrapAccent(change.state, 'italic');
      expect(Plain.serialize(newState)).to.equal('_italic text_');
    });

    it('Wrap strikethrough', () => {
      const nodeText = 'strikethrough text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo('strikethrough'.length, 'strikethrough'.length);
      let newState = wrapAccent(change.state, 'strikethrough');
      expect(Plain.serialize(newState)).to.equal('strikethrough~~~~ text');

      change.moveOffsetsTo(0, 'strikethrough'.length);
      newState = wrapAccent(change.state, 'strikethrough');
      expect(Plain.serialize(newState)).to.equal('~~strikethrough~~ text');

      change.moveOffsetsTo(0, 'strikethrough text'.length);
      newState = wrapAccent(change.state, 'strikethrough');
      expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');
    });
  });

  describe('Unwrap accents', () => {
    it.skip('Unwrap bold', () => {
      let nodeText = '**bold text**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo('**'.length, '**bold text'.length);
      let newState = unwrapAccent(change.state, 'bold');
      expect(Plain.serialize(newState)).to.equal('bold text');

      nodeText = 'simple text****';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();

      change.moveOffsetsTo('simple text**'.length, 'simple text**'.length);
      newState = unwrapAccent(change.state, 'bold');
      expect(Plain.serialize(newState)).to.equal('simple text');
    });

    it.skip('Unwrap italic', () => {
      let nodeText = '_italic text_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo('_'.length, '_italic text'.length);
      let newState = unwrapAccent(change.state, 'italic');
      expect(Plain.serialize(newState)).to.equal('italic text');

      nodeText = 'simple text__';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();

      change.moveOffsetsTo('simple text_'.length, 'simple text_'.length);
      newState = unwrapAccent(change.state, 'italic');
      expect(Plain.serialize(newState)).to.equal('simple text');
    });

    it.skip('Unwrap strikethrough', () => {
      let nodeText = '~~strikethrough text~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(2, '~~strikethrough text'.length);
      let newState = unwrapAccent(change.state, 'strikethrough');
      expect(Plain.serialize(newState)).to.equal('strikethrough text');

      nodeText = 'simple text~~~~';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();

      change.moveOffsetsTo('simple text~~'.length, 'simple text~~'.length);
      newState = unwrapAccent(change.state, 'strikethrough');
      expect(Plain.serialize(newState)).to.equal('simple text');
    });
  });

  describe('Wrap-unwrap Headers', () => {
    it('Wrap-unwrap', () => {
      let nodeText = 'Header';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(3, 3);

      let newState = wrapHeader(change.state, 1);
      expect(Plain.serialize(newState)).to.equal('# Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 1);
      expect(Plain.serialize(newState)).to.equal('Header');

      change = newState.change();
      newState = wrapHeader(change.state, 2);
      expect(Plain.serialize(newState)).to.equal('## Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 2);
      expect(Plain.serialize(newState)).to.equal('Header');

      change = newState.change();
      newState = wrapHeader(change.state, 3);
      expect(Plain.serialize(newState)).to.equal('### Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 3);
      expect(Plain.serialize(newState)).to.equal('Header');

      change = newState.change();
      newState = wrapHeader(change.state, 4);
      expect(Plain.serialize(newState)).to.equal('#### Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 4);
      expect(Plain.serialize(newState)).to.equal('Header');

      change = newState.change();
      newState = wrapHeader(change.state, 5);
      expect(Plain.serialize(newState)).to.equal('##### Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 5);
      expect(Plain.serialize(newState)).to.equal('Header');

      change = newState.change();
      newState = wrapHeader(change.state, 6);
      expect(Plain.serialize(newState)).to.equal('###### Header');

      change = newState.change();
      newState = unwrapHeader(change.state, 6);
      expect(Plain.serialize(newState)).to.equal('Header');
    });

    it('Change', () => {
      let nodeText = '# Header';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(5, 5);
      let newState = wrapHeader(change.state, 2);
      expect(Plain.serialize(newState)).to.equal('## Header');

      change = newState.change();
      newState = wrapHeader(change.state, 3);
      expect(Plain.serialize(newState)).to.equal('### Header');

      change = newState.change();
      newState = wrapHeader(change.state, 4);
      expect(Plain.serialize(newState)).to.equal('#### Header');

      change = newState.change();
      newState = wrapHeader(change.state, 5);
      expect(Plain.serialize(newState)).to.equal('##### Header');

      change = newState.change();
      newState = wrapHeader(change.state, 6);
      expect(Plain.serialize(newState)).to.equal('###### Header');

      change = newState.change();
      newState = wrapHeader(change.state, 1);
      expect(Plain.serialize(newState)).to.equal('# Header');
    });
  });

  describe('Wrap-unwrap lists', () => {
    it('Wrap-unwrap', () => {
      let nodeText = 'Item';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(3, 3);

      let newState = wrapAccent(change.state, 'ul');
      expect(Plain.serialize(newState)).to.equal('* Item');

      change = newState.change();
      newState = unwrapAccent(change.state, 'ul');
      expect(Plain.serialize(newState)).to.equal('Item');

      change = newState.change();
      newState = wrapAccent(change.state, 'ol');
      expect(Plain.serialize(newState)).to.equal('1. Item');

      change = newState.change();
      newState = unwrapAccent(change.state, 'ol');
      expect(Plain.serialize(newState)).to.equal('Item');
    });

    it('Change', () => {
      let nodeText = 'Item';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(3, 3);

      let newState = wrapAccent(change.state, 'ul');
      expect(Plain.serialize(newState)).to.equal('* Item');

      change = newState.change();
      newState = wrapAccent(change.state, 'ol');
      expect(Plain.serialize(newState)).to.equal('1. Item');

      change = newState.change();
      newState = wrapAccent(change.state, 'ul');
      expect(Plain.serialize(newState)).to.equal('* Item');

      change = newState.change();
      newState = wrapHeader(change.state, 6);
      expect(Plain.serialize(newState)).to.equal('###### Item');

      change = newState.change();
      newState = wrapAccent(change.state, 'ol');
      expect(Plain.serialize(newState)).to.equal('1. Item');

      wrapper.setProps({ value: '  2. List Item 2' });
      editorState = wrapper.state('editorState');
      newState = wrapAccent(editorState, 'ul');
      expect(Plain.serialize(newState)).to.equal('* List Item 2');

      wrapper.setProps({ value: '    3) List Item 3' });
      editorState = wrapper.state('editorState');
      newState = wrapAccent(editorState, 'ul');
      expect(Plain.serialize(newState)).to.equal('* List Item 3');

      wrapper.setProps({ value: '    3) List Item' });
      editorState = wrapper.state('editorState');
      newState = wrapHeader(editorState, 6);
      expect(Plain.serialize(newState)).to.equal('###### List Item');

      wrapper.setProps({ value: '  + List Item' });
      editorState = wrapper.state('editorState');
      newState = wrapHeader(editorState, 3);
      expect(Plain.serialize(newState)).to.equal('### List Item');

      wrapper.setProps({ value: '    - List Item' });
      editorState = wrapper.state('editorState');
      newState = wrapAccent(editorState, 'ol');
      expect(Plain.serialize(newState)).to.equal('1. List Item');
    });
  });

  describe('Wrap Link', () => {
    it('wrapLinkMarkdown', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();

      change.moveOffsetsTo(0, 4);

      let newState = wrapLinkMarkdown(change.state);
      expect(Plain.serialize(newState)).to.equal('[text](http://example.com)');

      nodeText = ' other text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();

      change.moveOffsetsTo(0, 0);

      newState = wrapLinkMarkdown(change.state);
      expect(Plain.serialize(newState)).to.equal('[link text](http://example.com) other text');
    });
  });
});
