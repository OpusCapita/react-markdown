/* eslint-disable max-len */

import { assert, expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import {
  hasItalicMarkdown,
  wrapItalicMarkdown,
  unwrapItalicMarkdown,
  hasBoldMarkdown,
  wrapBoldMarkdown,
  unwrapBoldMarkdown,
  hasStrikethroughMarkdown,
  wrapStrikethroughMarkdown,
  unwrapStrikethroughMarkdown
} from './transforms';

function changeCursorPos(state, posStart, posEnd = posStart) {
  state.startOffset = posStart; // eslint-disable-line
  state.endOffset = posStart; // eslint-disable-line
}

describe('plain editor transform', () => {
  describe('Has Marks', () => {
    it('just a text', () => {
      const state = {
        focusText: { text: 'just a text' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isFalse(hasItalicMarkdown(state));
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 1);
      assert.isFalse(hasItalicMarkdown(state));
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 10);
      assert.isFalse(hasItalicMarkdown(state));
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 11);
      assert.isFalse(hasItalicMarkdown(state));
      assert.isFalse(hasBoldMarkdown(state));
    });

    it('*italic text*', () => {
      const state = {
        focusText: { text: '*italic text*' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('_italic text_', () => {
      const state = {
        focusText: { text: '_italic text_' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('**bold text**', () => {
      const state = {
        focusText: { text: '**bold text**' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 11);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasBoldMarkdown(state));
    });

    it('__bold text__', () => {
      const state = {
        focusText: { text: '__bold text__' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 11);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasBoldMarkdown(state));
    });

    it('____ __bold text__', () => {
      const state = {
        focusText: { text: '____ __bold text__' },
        startOffset: 0,
        endOffset: 0
      };
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 4);
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 5);
      assert.isFalse(hasBoldMarkdown(state));
      changeCursorPos(state, 6);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 7);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 16);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 17);
      assert.isTrue(hasBoldMarkdown(state));
      changeCursorPos(state, 18);
      assert.isFalse(hasBoldMarkdown(state));
    });

    it('***bold italic text***', () => {
      const state = {
        focusText: { text: '***bold italic text***' },
        startOffset: 0,
        endOffset: 0
      };
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 7);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 19);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 20);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 21);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 22);
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('___bold italic text___', () => {
      const state = {
        focusText: { text: '___bold italic text___' },
        startOffset: 0,
        endOffset: 0
      };
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 7);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 19);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 20);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 21);
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 22);
      assert.isFalse(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('***bold and** italic text*', () => {
      const state = {
        focusText: { text: '***bold and** italic text*' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 11);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 25);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 26);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('***italic and* bold text**', () => {
      const state = {
        focusText: { text: '***italic and* bold text**' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 14);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 24);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 25);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 26);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('___bold and__ italic text_', () => {
      const state = {
        focusText: { text: '___bold and__ italic text_' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 11);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 12);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 25);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 26);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('___italic and_ bold text__', () => {
      const state = {
        focusText: { text: '___italic and_ bold text__' },
        startOffset: 5,
        endOffset: 5
      };
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 1);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 2);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 13);
      assert.isTrue(hasItalicMarkdown(state));
      changeCursorPos(state, 14);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 24);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 25);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 0);
      assert.isFalse(hasItalicMarkdown(state));
      changeCursorPos(state, 26);
      assert.isFalse(hasItalicMarkdown(state));
    });

    it('~~strike-through text~~', () => {
      const state = {
        focusText: { text: '~~strike-through text~~' },
        startOffset: 0,
        endOffset: 0
      };
      assert.isFalse(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 1);
      assert.isTrue(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 2);
      assert.isTrue(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 3);
      assert.isTrue(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 21);
      assert.isTrue(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 22);
      assert.isTrue(hasStrikethroughMarkdown(state));
      changeCursorPos(state, 23);
      assert.isFalse(hasStrikethroughMarkdown(state));
    });

    it('**bold _not italic** text_', () => {
      let state = Plain.deserialize('**bold _not italic** text_').
      transform().moveOffsetsTo('**bold _not'.length, '**bold _not italic'.length).apply();
      assert.isFalse(hasItalicMarkdown(state));
      assert.isTrue(hasBoldMarkdown(state));

      state = Plain.deserialize('**bold _not italic** text_').
      transform().moveOffsetsTo(2, '**bold _not italic'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
    });
  });

  describe('Has Marks of a selected text', () => {
    it('*italic text*', () => {
      let state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(1, '*italic text'.length).apply();
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(0, '*italic text*'.length).apply();
      assert.isTrue(hasItalicMarkdown(state));
    });

    it('**bold text**', () => {
      let state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo(2, '**bold text'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo(0, '**bold text**'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
    });

    it('~~strike-through text~~', () => {
      let state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(2, '~~strike-through text'.length).apply();
      assert.isTrue(hasStrikethroughMarkdown(state));

      state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(0, '~~strike-through text~~'.length).apply();
      assert.isTrue(hasStrikethroughMarkdown(state));
    });

    it('***bold and italic text***', () => {
      let state = Plain.deserialize('***bold and italic text***').
      transform().moveOffsetsTo(3, '***bold and italic text'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold and italic text***').
      transform().moveOffsetsTo(2, '***bold and italic text*'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold and italic text***').
      transform().moveOffsetsTo(1, '***bold and italic text**'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold and italic text***').
      transform().moveOffsetsTo(0, '***bold and italic text***'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));
    });

    it('***bold italic text*bold**', () => {
      let state = Plain.deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(2, '***bold italic text*'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isTrue(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(1, '***bold italic text*bold*'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo(0, '***bold italic text*bold**'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));

      state = Plain.deserialize('***bold italic text*bold**').
      transform().moveOffsetsTo('***bold'.length, '***bold italic text*bo'.length).apply();
      assert.isTrue(hasBoldMarkdown(state));
      assert.isFalse(hasItalicMarkdown(state));
    });
  });

  describe('Wrap marks', () => {
    it('Wrap bold', () => {
      let state = Plain.deserialize('bold text').
      transform().moveOffsetsTo(5, 5).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold ****text');

      state = Plain.deserialize('bold text').
      transform().moveOffsetsTo(0, 'bold'.length).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold** text');

      state = Plain.deserialize('bold text').
      transform().moveOffsetsTo(0, 'bold text'.length).apply();
      state = wrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text**');
    });

    it('Wrap italic', () => {
      let state = Plain.deserialize('italic text').
      transform().moveOffsetsTo(7, 7).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic __text');

      state = Plain.deserialize('italic text').
      transform().moveOffsetsTo(0, 'italic'.length).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic_ text');

      state = Plain.deserialize('italic text').
      transform().moveOffsetsTo(0, 'italic text'.length).apply();
      state = wrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');
    });

    it('Wrap strike-through', () => {
      let state = Plain.deserialize('strike-through text').
      transform().moveOffsetsTo('strike-through'.length, 'strike-through'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through~~~~ text');

      state = Plain.deserialize('strike-through text').
      transform().moveOffsetsTo(0, 'strike-through'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through~~ text');

      state = Plain.deserialize('strike-through text').
      transform().moveOffsetsTo(0, 'strike-through text'.length).apply();
      state = wrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');
    });
  });

  describe('Unwrap marks', () => {
    it('Unwrap bold from **bold text**', () => {
      let state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo('**'.length, '**bold text'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo('**bold text*'.length, '**bold text*'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo(0, 0).apply();
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text**');

      state = Plain.deserialize('**bold text**').
      transform().moveOffsetsTo('**bold text**'.length, '**bold text**'.length).apply();
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold text**');
    });

    it('Unwrap bold from __bold text__', () => {
      let state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo('__'.length, '__bold text'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo('__bold text_'.length, '__bold text_'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold text');

      state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo(0, 0).apply();
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('__bold text__');

      state = Plain.deserialize('__bold text__').
      transform().moveOffsetsTo('__bold text__'.length, '__bold text__'.length).apply();
      expect(hasBoldMarkdown(state)).is.not.equal(true);
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('__bold text__');
    });

    it('Unwrap italic from *italic text*', () => {
      let state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(1, '*italic text'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo('*italic text'.length, '*italic text'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo(0, 0).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*italic text*');

      state = Plain.deserialize('*italic text*').
      transform().moveOffsetsTo('*italic text*'.length, '*italic text*'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*italic text*');
    });

    it('Unwrap italic from _italic text_', () => {
      let state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo('_'.length, '_italic text'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo('_italic text'.length, '_italic text'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('italic text');

      state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo(0, 0).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');

      state = Plain.deserialize('_italic text_').
      transform().moveOffsetsTo('_italic text_'.length, '_italic text_'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('_italic text_');
    });

    it('Unwrap from simple text', () => {
      let state = Plain.deserialize('just a text').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('just a text');
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('just a text');
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('just a text');
    });

    it('Unwrap strike-through from ~~strike-through text~~', () => {
      let state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(2, '~~strike-through text'.length).apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = Plain.deserialize('~~strike-through text~~').
      transform().
      moveOffsetsTo('~~strike-through text~'.length, '~~strike-through text~'.length).
      apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('strike-through text');

      state = Plain.deserialize('~~strike-through text~~').
      transform().moveOffsetsTo(0, 0).apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');

      state = Plain.deserialize('~~strike-through text~~').
      transform().
      moveOffsetsTo('~~strike-through text~~'.length, '~~strike-through text~~'.length).
      apply();
      state = unwrapStrikethroughMarkdown(state);
      expect(Plain.serialize(state)).to.equal('~~strike-through text~~');
    });

    it('Unwrap from ***bold italic text***', () => {
      let state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo('**'.length, '***bold italic text*'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(6, 6).apply();
      state = unwrapBoldMarkdown(state);
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(1, 1).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold italic text**');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(2, 2).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold italic text**');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo('***bold italic text**'.length, '***bold italic text**'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo('***bold italic text*'.length, '***bold italic text*'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo('***bold italic text**'.length, '***bold italic text**'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold italic text**');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo('***bold italic text*'.length, '***bold italic text*'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold italic text**');
    });

    it('Unwrap of a selected text', () => {
      let state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply();
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('**bold italic text**');
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(3, '***bold italic text'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');

      state = Plain.deserialize('***bold italic text***').
      transform().moveOffsetsTo(0, '***bold italic text***'.length).apply();
      state = unwrapBoldMarkdown(state);
      expect(Plain.serialize(state)).to.equal('*bold italic text*');
      state = unwrapItalicMarkdown(state);
      expect(Plain.serialize(state)).to.equal('bold italic text');
    });
  });
});
