/* eslint-disable max-len */

import React from 'react';
import { expect } from 'chai';
// import { assert, expect } from 'chai';
// import { mount, shallow } from 'enzyme';
import { shallow } from 'enzyme';
import Plain from 'slate-plain-serializer';
import PlainMarkdownInput from '../../PlainMarkdownInput.react';
import {
  hasAccent,
  wrapAccent,
  // unwrapAccent,
  hasHeader,
  // wrapHeader,
  // unwrapHeader,
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

      let wrapper = shallow(component);
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
    });

    it('Ordered', () => {
      const nodeText = '1. List item 1';
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
      expect(hasAccent(newState, 'ol')).to.equal(true);
      expect(hasHeader(newState, 1)).to.equal(false);
      expect(hasHeader(newState, 2)).to.equal(false);
      expect(hasHeader(newState, 3)).to.equal(false);
      expect(hasHeader(newState, 4)).to.equal(false);
      expect(hasHeader(newState, 5)).to.equal(false);
      expect(hasHeader(newState, 6)).to.equal(false);
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

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
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
    });

    it('**bold**', () => {
      const nodeText = '**bold**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
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
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'bold')).to.equal(false);
    });

    it('~~strikethrough~~', () => {
      const nodeText = '~~strikethrough~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
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
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(5, 5);
      newState = change.state;
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);
    });

    it('_**bold italic**_', () => {
      const nodeText = '_**bold italic**_';
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
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
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
    });

    it('**_bold italic_**', () => {
      const nodeText = '**_bold italic_**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
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
    });

    it('_~~strikethrough italic~~_', () => {
      const nodeText = '_~~strikethrough italic~~_';
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
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

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
    });

    it('~~_strikethrough italic_~~', () => {
      const nodeText = '~~_strikethrough italic_~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(true);
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
    });

    it('**~~strikethrough bold~~**', () => {
      const nodeText = '**~~strikethrough bold~~**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(4, nodeText.length - 4);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

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
    });

    it('~~**strikethrough bold**~~', () => {
      const nodeText = '~~**strikethrough bold**~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={true}
        readOnly={true}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(4, nodeText.length - 4);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
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
    });

    it('_~~**italic strikethrough bold**~~_', () => {
      const nodeText = '_~~**italic strikethrough bold**~~_';
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
      expect(hasAccent(newState, 'italic')).to.equal(true);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(3, nodeText.length - 3);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(true);

      change.moveOffsetsTo(5, nodeText.length - 5);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(true);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(0, nodeText.length);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);

      change.moveOffsetsTo(7, 7);
      newState = change.state;
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);
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

  describe.skip('Unwrap marks', () => {
    it('Unwrap bold from **bold text**', () => {
      let state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo('**'.length, '**bold text'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(6, 6).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(1, 1).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo('**bold text*'.length, '**bold text*'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(0, 0).apply());
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text**');

      state = createCustomCharacters(deserialize('**bold text** ').
      transform().moveOffsetsTo('**bold text**'.length, '**bold text**'.length).apply());
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text** ');
    });

    it('Unwrap bold from __bold text__', () => {
      let state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo('__'.length, '__bold text'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo(6, 6).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo(1, 1).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo('__bold text_'.length, '__bold text_'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo(0, 0).apply());
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('__bold text__');

      state = createCustomCharacters(deserialize('__bold text__ ').
      transform().moveOffsetsTo('__bold text__'.length, '__bold text__'.length).apply());
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('__bold text__ ');
    });

    it('Unwrap italic from *italic text*', () => {
      let state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(1, '*italic text'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(6, 6).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(1, 1).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo('*italic text'.length, '*italic text'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(0, 0).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*italic text*');

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo('*italic text*'.length, '*italic text*'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*italic text*');
    });

    it('Unwrap italic from _italic text_', () => {
      let state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo('_'.length, '_italic text'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo(6, 6).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo(1, 1).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo('_italic text'.length, '_italic text'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo(0, 0).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');

      state = createCustomCharacters(deserialize('_italic text_').
      transform().moveOffsetsTo('_italic text_'.length, '_italic text_'.length).apply());
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');
    });

    it('Unwrap from simple text', () => {
      let state = createCustomCharacters(deserialize('just a text').
      transform().moveOffsetsTo(6, 6).apply());
      state = createCustomCharacters(unwrapItalicMarkdown(state));
      expect(Plain.serialize(state)).to.equal('just a text');
      state = createCustomCharacters(unwrapBoldMarkdown(state));
      expect(Plain.serialize(state)).to.equal('just a text');
      state = createCustomCharacters(unwrapStrikethroughMarkdown(state));
      expect(Plain.serialize(state)).to.equal('just a text');
    });

    it('Unwrap strike-through from ~~strike-through text~~', () => {
      let state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(2, '~~strike-through text'.length).apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(6, 6).apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(1, 1).apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().
      moveOffsetsTo('~~strike-through text~'.length, '~~strike-through text~'.length).
      apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(0, 0).apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().
      moveOffsetsTo('~~strike-through text~~'.length, '~~strike-through text~~'.length).
      apply());
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');
    });

    it('Unwrap from ***bold italic text***', () => {
      let state = createCustomCharacters(deserialize('***bold italic text***').
      transform().moveOffsetsTo('**'.length, '***bold italic text*'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');

      state = createCustomCharacters(deserialize('***bold italic text***').
      transform().moveOffsetsTo(6, 6).apply());
      state = createCustomCharacters(unwrapBoldMarkdown(state));
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = createCustomCharacters(deserialize('***bold italic text***').transform().
      moveOffsetsTo('***bold italic text**'.length, '***bold italic text**'.length).apply());
      state = createCustomCharacters(unwrapBoldMarkdown(state));
      expect(Plain.serialize(state)).to.equal('*bold italic text*');

      state = createCustomCharacters(deserialize('***bold italic text***').transform().
      moveOffsetsTo('***bold italic text*'.length, '***bold italic text*'.length).apply());
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');
    });

    it('Unwrap of a selected text', () => {
      let state = createCustomCharacters(deserialize('***bold italic text***').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply());
      state = createCustomCharacters(unwrapItalicMarkdown(state));
      expect(Plain.serialize(state)).to.equal('**bold italic text**');
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = createCustomCharacters(deserialize('***bold italic text***').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply());
      state = createCustomCharacters(unwrapBoldMarkdown(state));
      expect(Plain.serialize(state)).to.equal('*bold italic text*');
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = createCustomCharacters(deserialize('***bold italic text***').
      transform().moveOffsetsTo(0, '***bold italic text***'.length).apply());
      state = createCustomCharacters(unwrapBoldMarkdown(state));
      expect(Plain.serialize(state)).to.equal('*bold italic text*');
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');
    });
  });
});
