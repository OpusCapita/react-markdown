/* eslint-disable max-len */

import React from 'react';
import { assert, expect } from 'chai';
// import { mount, shallow } from 'enzyme';
import { mount } from 'enzyme';
import Plain from 'slate-plain-serializer';
import PlainMarkdownInput from '../../PlainMarkdownInput.react';
import {
  hasAccent,
  // wrapAccent,
  // unwrapAccent,
  hasHeader,
  // wrapHeader,
  // unwrapHeader,
  hasMultiLineSelection
} from '../transforms';

describe('plain editor transform', () => {
  describe('Lists', () => {
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
    });
  });

  describe('Headers', () => {
    it('# Header1', () => {
      const nodeText = '# Header1';
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

      let wrapper = mount(component);
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

      let wrapper = mount(component);
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

      let wrapper = mount(component);
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

      let wrapper = mount(component);
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

      let wrapper = mount(component);
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

      let wrapper = mount(component);
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
      expect(hasAccent(newState, 'italic')).to.equal(false);
      expect(hasAccent(newState, 'bold')).to.equal(false);
      expect(hasAccent(newState, 'strikethrough')).to.equal(false);
    });

    it.skip('*italic text*', () => {
      let state = createCustomCharacters(deserialize('*italic text* ').
      transform().moveOffsetsTo(5, 5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12, 12).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0, 0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(13, 13).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('_italic text_', () => {
      let state = createCustomCharacters(deserialize('_italic text_ ').
      transform().moveOffsetsTo(5, 5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12, 12).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0, 0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(13, 13).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('**bold text**', () => {
      let state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(5, 5).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2, 2).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(11, 11).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12, 12).apply());
      assert.isTrue(hasBoldMarkdown(state));
    });

    it.skip('__bold text__', () => {
      let state = createCustomCharacters(deserialize('__bold text__').
      transform().moveOffsetsTo(5, 5).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2, 2).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(11, 11).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12, 12).apply());
      assert.isTrue(hasBoldMarkdown(state));
    });

    it.skip('____ __bold text__', () => {
      let state = createCustomCharacters(deserialize('____ __bold text__ ').
      transform().moveOffsetsTo(0, 0).apply());
      assert.isFalse(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2, 2).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3, 3).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(6, 6).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(7, 7).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(16, 16).apply());
      assert.isTrue(hasBoldMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(17, 17).apply());
      assert.isTrue(hasBoldMarkdown(state));
    });

    it.skip('***bold italic text***', () => {
      let state = createCustomCharacters(deserialize('***bold italic text*** ').
      transform().moveOffsetsTo(0, 0).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2, 2).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3, 3).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(7, 7).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(19, 19).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(20, 20).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(21, 21).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(22, 22).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('___bold italic text___', () => {
      let state = createCustomCharacters(deserialize('___bold italic text___ ').
      transform().moveOffsetsTo(0, 0).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1, 1).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2, 2).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3, 3).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(7, 7).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(19, 19).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(20, 20).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(21, 21).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(22, 22).apply());
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('***bold and** italic text*', () => {
      let state = createCustomCharacters(deserialize('***bold and** italic text* ').
      transform().moveOffsetsTo(5, 5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3, 3).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(11).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3, 3).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(25).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(26).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('***italic and* bold text**', () => {
      let state = createCustomCharacters(deserialize('***italic and* bold text** ').
      transform().moveOffsetsTo(5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(13).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(14).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(24).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(25).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(26).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    // this case is not realized
    it.skip('___bold and__ italic text_', () => {
      let state = createCustomCharacters(deserialize('___bold and__ italic text_ ').
      transform().moveOffsetsTo(5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(11).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(12).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(13).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(25).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(26).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('___italic and_ bold text__', () => {
      let state = createCustomCharacters(deserialize('___italic and_ bold text__ ').
      transform().moveOffsetsTo(5).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(13).apply());
      assert.isTrue(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(14).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(24).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(25).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(0).apply());
      assert.isFalse(hasItalicMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(26).apply());
      assert.isFalse(hasItalicMarkdown(state));
    });

    it.skip('~~strike-through text~~', () => {
      let state = createCustomCharacters(deserialize('~~strike-through text~~ ').
      transform().moveOffsetsTo(0).apply());
      assert.isFalse(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(1).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(2).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(3).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(21).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(22).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
      state = createCustomCharacters(state.transform().moveOffsetsTo(23).apply());
      assert.isFalse(hasStrikethroughMarkdown(state));
    });

    it.skip('**bold _not italic** text_', () => {
      let state = createCustomCharacters(deserialize('**bold _not italic** text_').
      transform().moveOffsetsTo('**bold _not'.length, '**bold _not italic'.length).apply());
      assert.isFalse(hasItalicMarkdown(state));
      assert.isTrue(hasBoldMarkdown(state));

      state = createCustomCharacters(deserialize('**bold _not italic** text_').
      transform().moveOffsetsTo(2, '**bold _not italic'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
    });
  });

  describe.skip('Has Marks of a selected text', () => {
    it('*italic text*', () => {
      let state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(1, '*italic text'.length).apply());
      assert.isTrue(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('*italic text*').
      transform().moveOffsetsTo(0, '*italic text*'.length).apply());
      assert.isTrue(hasItalicMarkdown(state));
    });

    it('**bold text**', () => {
      let state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(2, '**bold text'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));

      state = createCustomCharacters(deserialize('**bold text**').
      transform().moveOffsetsTo(0, '**bold text**'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
    });

    it('~~strike-through text~~', () => {
      let state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(2, '~~strike-through text'.length).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));

      state = createCustomCharacters(deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(0, '~~strike-through text~~'.length).apply());
      assert.isTrue(hasStrikethroughMarkdown(state));
    });

    it('***bold and italic text***', () => {
      let state = createCustomCharacters(deserialize('***bold and italic text***').
      transform().moveOffsetsTo(3, '***bold and italic text'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold and italic text***').
      transform().moveOffsetsTo(2, '***bold and italic text*'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold and italic text***').
      transform().moveOffsetsTo(1, '***bold and italic text**'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold and italic text*** ').
      transform().moveOffsetsTo(0, '***bold and italic text***'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('***bold italic text*bold**', () => {
      let state = createCustomCharacters(deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(2, '***bold italic text*'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(1, '***bold italic text*bold*'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(0, '***bold italic text*bold**'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));

      state = createCustomCharacters(deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo('***bold'.length, '***bold italic text*bo'.length).apply());
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });
  });

  describe.skip('Wrap marks', () => {
    it('Wrap bold', () => {
      let state = deserialize('bold text').
      transform().moveOffsetsTo(5, 5).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold ****text');

      state = deserialize('bold text').
      transform().moveOffsetsTo(0, 'bold'.length).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold** text');

      state = deserialize('bold text').
      transform().moveOffsetsTo(0, 'bold text'.length).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text**');
    });

    it('Wrap italic', () => {
      let state = deserialize('italic text').
      transform().moveOffsetsTo(7, 7).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic __text');

      state = deserialize('italic text').
      transform().moveOffsetsTo(0, 'italic'.length).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic_ text');

      state = deserialize('italic text').
      transform().moveOffsetsTo(0, 'italic text'.length).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');
    });

    it('Wrap strike-through', () => {
      let state = deserialize('strike-through text').
      transform().moveOffsetsTo('strike-through'.length, 'strike-through'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through~~~~ text');

      state = deserialize('strike-through text').
      transform().moveOffsetsTo(0, 'strike-through'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through~~ text');

      state = deserialize('strike-through text').
      transform().moveOffsetsTo(0, 'strike-through text'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');
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

  describe.skip('multiline selection', () => {
    it('Has multiline selection', () => {
      let state = deserialize('some **text**\nnext line').
      transform().selectAll().apply();
      assert.isTrue(hasMultiLineSelection(state));

      state = deserialize('some **text**\nnext line').transform().
      moveOffsetsTo('some'.length, 'some **text**\n'.length).apply();
      assert.isTrue(hasMultiLineSelection(state));

      state = deserialize('some **text**\nnext line').transform().
      moveOffsetsTo('some **text**'.length, 'some **text**\n'.length).apply();
      assert.isTrue(hasMultiLineSelection(state));
    });

    it('Has not multiline selection', () => {
      let state = deserialize('some **text**\nnext line').
      transform().moveOffsetsTo(0, 'some **text**'.length).apply();
      assert.isFalse(hasMultiLineSelection(state));

      state = deserialize('some **text**\nnext line').transform().
      moveOffsetsTo('some **text**\n'.length, 'some **text**\nnext line'.length).apply();
      assert.isFalse(hasMultiLineSelection(state));
    });
  });
});
