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
  wrapLink,
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

    it('Unordered Multiline Selection', () => {
      const nodeText = '* List item 1\n* List item 2';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.selectAll();
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(true);
      expect(hasAccent(newState, 'ol')).to.equal(false);
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

    it('Ordered Multiline Selection', () => {
      const nodeText = '1. List item 1\n2. List item 2';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.selectAll();
      let newState = change.state;

      expect(hasAccent(newState, 'ul')).to.equal(false);
      expect(hasAccent(newState, 'ol')).to.equal(true);
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
    describe('Wrap bold', () => {
      it('#1 no selection', () => {
        const nodeText = 'bold text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(5, 5);
        let newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold ****text');

        wrapper.setProps({ value: '' });
        editorState = wrapper.state('editorState');
        change = editorState.change();
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('****');
      });

      it('#2 both edges on emphasis, delete all internal markers', () => {
        let nodeText = '__bold__ text __bold__';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text bold__');

        change.moveOffsetsTo('__bold__'.length, '__bold__ text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text bold__');

        nodeText = '__bold__ text **bold**';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);

        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('__bold__'.length, '__bold__ text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text bold__');

        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text bold__');

        nodeText = `__bold__ text **bold**
new line`;
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('__bold__'.length, '__bold__ text **bold**'.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal(`__bold text bold__
new line`);

        change.moveOffsetsTo(0, '__bold__ text **bold**'.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal(`__bold text bold__
new line`);

        nodeText = '**bold** text **bold**';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold**');

        change.moveOffsetsTo('**bold**'.length, '**bold** text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold**');

        nodeText = '**bold** text __bold__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold**');

        change.moveOffsetsTo('**bold**'.length, '**bold** text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold**');

        nodeText = '**bold** text __bold__ text **bold**';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold text bold**');

        nodeText = '**bold** text __bold__ text __bold__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text bold text bold**');

        nodeText = '__bold__ text __bold__ text **bold**';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text bold text bold__');
      });

      it('#3 left edge on emphasis, right edge beyond markers', () => {
        let nodeText = '__bold__ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo('__bold__'.length, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        nodeText = '**bold** text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold**'.length, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');
      });

      it('#4 right edge on emphasis, left edge beyond markers', () => {
        let nodeText = 'text __bold__';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__text bold__');

        change.moveOffsetsTo(0, 'text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__text bold__');

        nodeText = 'text **bold**';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**text bold**');

        change.moveOffsetsTo(0, 'text '.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**text bold**');
      });

      it('#5 both edges beyond markers', () => {
        let nodeText = 'text __bold__ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**text bold text**');

        nodeText = 'text **bold** text';
        wrapper.setProps({ value: nodeText });
        editorState = wrapper.state('editorState');
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**text bold text**');
      });
    });

    describe('Wrap italic', () => {
      it('#1 no selection', () => {
        const nodeText = 'italic text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo('italic '.length, 'italic '.length);
        let newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic __text');

        wrapper.setProps({ value: '' });
        editorState = wrapper.state('editorState');
        change = editorState.change();
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('__');
      });

      it('#2 both edges on emphasis, delete all internal markers', () => {
        let nodeText = '_italic_ text _italic_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text italic_');

        change.moveOffsetsTo('_italic_'.length, '_italic_ text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text italic_');

        nodeText = '_italic_ text *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('_italic_'.length, '_italic_ text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text italic_');

        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text italic_');

        nodeText = '*italic* text *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic*');

        change.moveOffsetsTo('*italic*'.length, '*italic* text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic*');

        nodeText = '*italic* text _italic_';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic*');

        change.moveOffsetsTo('*italic*'.length, '*italic* text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic*');

        nodeText = '*italic* text _italic_ text *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic text italic*');

        nodeText = '*italic* text _italic_ text _italic_';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text italic text italic*');

        nodeText = '_italic_ text _italic_ text *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text italic text italic_');
      });

      it('#3 left edge on emphasis, right edge beyond markers', () => {
        let nodeText = '_italic_ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');

        change.moveOffsetsTo('_italic_'.length, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');

        nodeText = '*italic* text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text*');

        change.moveOffsetsTo('*italic*'.length, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*italic text*');
      });

      it('#4 right edge on emphasis, left edge beyond markers', () => {
        let nodeText = 'text _italic_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_text italic_');

        change.moveOffsetsTo(0, 'text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_text italic_');

        nodeText = 'text *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*text italic*');

        change.moveOffsetsTo(0, 'text '.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('*text italic*');
      });

      it('#5 both edges beyond markers', () => {
        let nodeText = 'text _italic_ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_text italic text_');

        nodeText = 'text *italic* text';
        wrapper.setProps({ value: nodeText });
        editorState = wrapper.state('editorState');
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_text italic text_');
      });
    });

    describe('Wrap strikethrough', () => {
      it('#1 no selection', () => {
        const nodeText = 'strikethrough text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo('strikethrough '.length, 'strikethrough '.length);
        let newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough ~~~~text');

        wrapper.setProps({ value: '' });
        editorState = wrapper.state('editorState');
        change = editorState.change();
        newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~~~');
      });

      it('#2 both edges on emphasis, delete all internal markers', () => {
        let nodeText = '~~strikethrough~~ text ~~strikethrough~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text strikethrough~~');

        change.moveOffsetsTo('~~strikethrough~~'.length, '~~strikethrough~~ text '.length);
        newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text strikethrough~~');

        nodeText = '~~strikethrough~~ text ~~strikethrough~~ ~~strikethrough~~';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).
        to.equal('~~strikethrough text strikethrough strikethrough~~');
      });

      it('#3 left edge on emphasis, right edge beyond markers', () => {
        let nodeText = '~~strikethrough~~ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough~~'.length, nodeText.length);
        newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');
      });

      it('#4 right edge on emphasis, left edge beyond markers', () => {
        let nodeText = 'text ~~strikethrough~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~text strikethrough~~');

        change.moveOffsetsTo(0, 'text '.length);
        newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~text strikethrough~~');
      });

      it('#5 both edges beyond markers', () => {
        let nodeText = 'text ~~strikethrough~~ text';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.moveOffsetsTo(0, nodeText.length);
        let newState = wrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~text strikethrough text~~');
      });
    });
  });

  describe('Unwrap accents', () => {
    describe('Unwrap bold', () => {
      it('#1 the cursor is wrapped in markers, delete markers', () => {
        let nodeText = 'simple text****';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('simple text**'.length, 'simple text**'.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('simple text');

        nodeText = 'simple **** text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('simple **'.length, 'simple **'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('simple  text');

        nodeText = '****simple text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('**'.length, '**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('simple text');
      });

      it('#2 the cursor on a marker, do nothing', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('*'.length, '*'.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**'.length, '**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold text'.length, '**bold text'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold text*'.length, '**bold text*'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');
      });

      it('#3 the between markers, add markers to the place of the cursor', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('**b'.length, '**b'.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**b****old text**');

        change.moveOffsetsTo('**bold'.length, '**bold'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold**** text**');

        change.moveOffsetsTo('**bold tex'.length, '**bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold tex****t**');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo('__b'.length, '__b'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__b____old text__');

        change.moveOffsetsTo('__bold'.length, '__bold'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold____ text__');

        change.moveOffsetsTo('__bold tex'.length, '__bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold tex____t__');
      });

      it('#4 - #5 the selection on the left or right edge, do nothing', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '*'.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo(0, '**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('*'.length, '**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold text'.length, '**bold text*'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold text'.length, '**bold text**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        change.moveOffsetsTo('**bold text*'.length, '**bold text**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold text**');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo(0, '_'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo(0, '__'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo('_'.length, '__'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo('__bold text'.length, '__bold text_'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo('__bold text'.length, '__bold text__'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');

        change.moveOffsetsTo('__bold text_'.length, '__bold text__'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold text__');
      });

      it('#6 the selection between markers, wrap selection in additional markers', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('**b'.length, '**bold '.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**b**old **text**');

        change.moveOffsetsTo('**b'.length, '**bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**b**old tex**t**');

        change.moveOffsetsTo('**bold'.length, '**bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold** tex**t**');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo('__b'.length, '__bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__b__old __text__');

        change.moveOffsetsTo('__b'.length, '__bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__b__old tex__t__');

        change.moveOffsetsTo('__bold'.length, '__bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold__ tex__t__');
      });

      it('#7 the selection on markers, delete markers', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, nodeText.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');

        change.moveOffsetsTo(1, nodeText.length - 1);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');

        change.moveOffsetsTo(2, nodeText.length - 2);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        wrapper.setProps({ value: nodeText });
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo(0, nodeText.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');

        change.moveOffsetsTo(1, nodeText.length - 1);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');

        change.moveOffsetsTo(2, nodeText.length - 2);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold text');
      });

      it('#8 startOffset on left marker, endOffset between markers', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '**bold '.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold **text**');

        change.moveOffsetsTo(0, '**bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold tex**t**');

        change.moveOffsetsTo('*'.length, '**bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold **text**');

        change.moveOffsetsTo('**'.length, '**bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold **text**');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo(0, '__bold '.length);
        change.moveOffsetsTo(0, '__bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold __text__');

        change.moveOffsetsTo(0, '__bold tex'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold tex__t__');

        change.moveOffsetsTo('_'.length, '__bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold __text__');

        change.moveOffsetsTo('__'.length, '__bold '.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('bold __text__');
      });

      it('#9 startOffset between markers, endOffset on right marker', () => {
        let nodeText = '**bold text**';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('**bold'.length, '**bold text'.length);
        let newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold** text');

        change.moveOffsetsTo('**b'.length, '**bold text'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**b**old text');

        change.moveOffsetsTo('**bold'.length, '**bold text*'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold** text');

        change.moveOffsetsTo('**bold'.length, '**bold text**'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('**bold** text');

        nodeText = '__bold text__';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo('__bold'.length, '__bold text'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold__ text');

        change.moveOffsetsTo('__b'.length, '__bold text'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__b__old text');

        change.moveOffsetsTo('__bold'.length, '__bold text_'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold__ text');

        change.moveOffsetsTo('__bold'.length, '__bold text__'.length);
        newState = unwrapAccent(change.state, 'bold');
        expect(Plain.serialize(newState)).to.equal('__bold__ text');
      });
    });

    describe('Unwrap strikethrough', () => {
      it('#1 the cursor is wrapped in markers, delete markers', () => {
        let nodeText = 'simple text~~~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('simple text~~'.length, 'simple text~~'.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('simple text');

        nodeText = 'simple ~~~~ text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('simple ~~'.length, 'simple ~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('simple  text');

        nodeText = '~~~~simple text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('~~'.length, '~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('simple text');
      });

      it('#2 the cursor on a marker, do nothing', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('~'.length, '~'.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~'.length, '~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough text'.length, '~~strikethrough text'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough text~'.length, '~~strikethrough text~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');
      });

      it('#3 the between markers, add markers to the place of the cursor', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('~~s'.length, '~~s'.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~s~~~~trikethrough text~~');

        change.moveOffsetsTo('~~strikethrough'.length, '~~strikethrough'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough~~~~ text~~');

        change.moveOffsetsTo('~~strikethrough tex'.length, '~~strikethrough tex'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough tex~~~~t~~');
      });

      it('#4 - #5 the selection on the left or right edge, do nothing', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '~'.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo(0, '~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~'.length, '~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough text'.length, '~~strikethrough text~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough text'.length, '~~strikethrough text~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');

        change.moveOffsetsTo('~~strikethrough text~'.length, '~~strikethrough text~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');
      });

      it('#6 the selection between markers, wrap selection in additional markers', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('~~s'.length, '~~strikethrough '.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~s~~trikethrough ~~text~~');

        change.moveOffsetsTo('~~s'.length, '~~strikethrough tex'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~s~~trikethrough tex~~t~~');

        change.moveOffsetsTo('~~strikethrough'.length, '~~strikethrough tex'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough~~ tex~~t~~');
      });

      it('#7 the selection on markers, delete markers', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, nodeText.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough text');

        change.moveOffsetsTo(1, nodeText.length - 1);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough text');

        change.moveOffsetsTo(2, nodeText.length - 2);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough text');
      });

      it('#8 startOffset on left marker, endOffset between markers', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '~~strikethrough '.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough ~~text~~');

        change.moveOffsetsTo(0, '~~strikethrough tex'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough tex~~t~~');

        change.moveOffsetsTo('~'.length, '~~strikethrough '.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough ~~text~~');

        change.moveOffsetsTo('~~'.length, '~~strikethrough '.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('strikethrough ~~text~~');
      });

      it('#9 startOffset between markers, endOffset on right marker', () => {
        let nodeText = '~~strikethrough text~~';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('~~strikethrough'.length, '~~strikethrough text'.length);
        let newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough~~ text');

        change.moveOffsetsTo('~~s'.length, '~~strikethrough text'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~s~~trikethrough text');

        change.moveOffsetsTo('~~strikethrough'.length, '~~strikethrough text*'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough~~ text');

        change.moveOffsetsTo('~~strikethrough'.length, '~~strikethrough text~~'.length);
        newState = unwrapAccent(change.state, 'strikethrough');
        expect(Plain.serialize(newState)).to.equal('~~strikethrough~~ text');
      });
    });

    describe('Unwrap italic', () => {
      it('#1 the cursor is wrapped in markers, delete markers', () => {
        let nodeText = 'simple text__';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('simple text_'.length, 'simple text_'.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('simple text');

        nodeText = 'simple __ text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('simple _'.length, 'simple _'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('simple  text');

        nodeText = '__simple text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();
        change.moveOffsetsTo('_'.length, '_'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('simple text');
      });

      it('#2 the cursor on a marker, do nothing', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('_'.length, '_'.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');

        change.moveOffsetsTo('_italic text'.length, '_italic text'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');
      });

      it('#3 the between markers, add markers to the place of the cursor', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('_i'.length, '_i'.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_i__talic text_');

        change.moveOffsetsTo('_italic'.length, '_italic'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic__ text_');

        change.moveOffsetsTo('_italic tex'.length, '_italic tex'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic tex__t_');
      });

      it('#4 - #5 the selection on the left or right edge, do nothing', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '_'.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');

        change.moveOffsetsTo('_italic text'.length, '_italic text_'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic text_');
      });

      it('#6 the selection between markers, wrap selection in additional markers', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('_i'.length, '_italic '.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_i_talic _text_');

        change.moveOffsetsTo('_i'.length, '_italic tex'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_i_talic tex_t_');

        change.moveOffsetsTo('_italic'.length, '_italic tex'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic_ tex_t_');
      });

      it('#7 the selection on markers, delete markers', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, nodeText.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic text');

        change.moveOffsetsTo(1, nodeText.length - 1);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic text');

        nodeText = '##### header *italic*';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo('##### header '.length, '##### header *italic*'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('##### header italic');

        nodeText = '##### header *italic* text';
        component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);
        wrapper = mount(component);
        editorState = wrapper.state('editorState');
        change = editorState.change();

        change.moveOffsetsTo('##### header '.length, '##### header *italic*'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('##### header italic text');
      });

      it('#8 startOffset on left marker, endOffset between markers', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo(0, '_italic '.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic _text_');

        change.moveOffsetsTo(0, '_italic tex'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic tex_t_');

        change.moveOffsetsTo('_'.length, '_italic '.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('italic _text_');
      });

      it('#9 startOffset between markers, endOffset on right marker', () => {
        let nodeText = '_italic text_';
        let component = (<PlainMarkdownInput
          value={nodeText}
          fullScreen={true}
          readOnly={true}
        />);

        let wrapper = mount(component);
        let editorState = wrapper.state('editorState');
        let change = editorState.change();

        change.moveOffsetsTo('_italic'.length, '_italic text'.length);
        let newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic_ text');

        change.moveOffsetsTo('_i'.length, '_italic text'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_i_talic text');

        change.moveOffsetsTo('_italic'.length, '_italic text_'.length);
        newState = unwrapAccent(change.state, 'italic');
        expect(Plain.serialize(newState)).to.equal('_italic_ text');
      });
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
    it('wrap', () => {
      let nodeText = 'Item 1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);
      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let newState = wrapAccent(editorState, 'ol');
      expect(Plain.serialize(newState)).to.equal('1. Item 1');

      newState = wrapAccent(editorState, 'ul');
      expect(Plain.serialize(newState)).to.equal('* Item 1');
    });

    it('wrap multiline to lists', () => {
      let lists = [
        `1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5`,
        `1) Item 1
2) Item 2
3) Item 3
4) Item 4
5) Item 5`,
        `1. Item 1
  2) Item 2
3. Item 3
  4) Item 4
  5) Item 5`,
        `Item 1
Item 2
Item 3
Item 4
Item 5`,
      ];
      let pattern = `* Item 1
* Item 2
* Item 3
* Item 4
* Item 5`;
      let component = (<PlainMarkdownInput
        value=""
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);

      for (let i = 0; i < lists.length; i++) {
        wrapper.setProps({ value: lists[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.selectAll();
        let newState = wrapAccent(change.state, 'ul');
        expect(Plain.serialize(newState)).to.equal(pattern);
      }

      lists = [
        `+ Item 1
+ Item 2
- Item 3
- Item 4
* Item 5`,
        `+ Item 1
  - Item 2
+ Item 3
  - Item 4
  * Item 5`,
        `Item 1
Item 2
Item 3
Item 4
Item 5`,
      ];
      pattern = `1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5`;

      for (let i = 0; i < lists.length; i++) {
        wrapper.setProps({ value: lists[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.selectAll();
        let newState = wrapAccent(change.state, 'ol');
        expect(Plain.serialize(newState)).to.equal(pattern);
      }

      lists = [
        `3. Item 1
+ Item 2
- Item 3
- Item 4
* Item 5`,
      ];
      pattern = `3. Item 1
4. Item 2
5. Item 3
6. Item 4
7. Item 5`;

      for (let i = 0; i < lists.length; i++) {
        wrapper.setProps({ value: lists[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.selectAll();
        let newState = wrapAccent(change.state, 'ol');
        expect(Plain.serialize(newState)).to.equal(pattern);
      }
    });

    it('unwrap', () => {
      let component = (<PlainMarkdownInput
        value=""
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);

      let items = [
        '1. Item 1',
        '1) Item 1',
        '  1. Item 1',
        '  1) Item 1',
        '    1. Item 1',
        '    1) Item 1',
      ];

      for (let i = 0; i < items.length; i++) {
        wrapper.setProps({ value: items[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        let newState = unwrapAccent(change.state, 'ol');
        expect(Plain.serialize(newState)).to.equal('Item 1');
      }

      items = [
        '* Item 1',
        '+ Item 1',
        '- Item 1',
        '  * Item 1',
        '  + Item 1',
        '  - Item 1',
        '    * Item 1',
        '    + Item 1',
        '    - Item 1',
      ];

      for (let i = 0; i < items.length; i++) {
        wrapper.setProps({ value: items[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        let newState = unwrapAccent(change.state, 'ul');
        expect(Plain.serialize(newState)).to.equal('Item 1');
      }
    });

    it('unwrap multiline lists', () => {
      let lists = [
        `1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5`,
        `1) Item 1
2) Item 2
3) Item 3
4) Item 4
5) Item 5`,
        `1. Item 1
  2) Item 2
3. Item 3
  4) Item 4
  5) Item 5`,
      ];
      let pattern = `Item 1
Item 2
Item 3
Item 4
Item 5`;
      let component = (<PlainMarkdownInput
        value=""
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);

      for (let i = 0; i < lists.length; i++) {
        wrapper.setProps({ value: lists[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.selectAll();
        let newState = unwrapAccent(change.state, 'ol');
        expect(Plain.serialize(newState)).to.equal(pattern);
      }

      lists = [
        `+ Item 1
+ Item 2
- Item 3
- Item 4
* Item 5`,
        `+ Item 1
  - Item 2
+ Item 3
  - Item 4
  * Item 5`,
      ];

      for (let i = 0; i < lists.length; i++) {
        wrapper.setProps({ value: lists[i] });
        let editorState = wrapper.state('editorState');
        let change = editorState.change();
        change.selectAll();
        let newState = unwrapAccent(change.state, 'ul');
        expect(Plain.serialize(newState)).to.equal(pattern);
      }
    });

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
    it('wrapLink', () => {
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

      let newState = wrapLink(change.state);
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

      newState = wrapLink(change.state);
      expect(Plain.serialize(newState)).to.equal('[link text](http://example.com) other text');
    });
  });
});
