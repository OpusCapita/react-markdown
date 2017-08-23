/* eslint-disable max-len */

import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import deserialize from '../deserialize';
import shortcuts from '../shortcuts';
import {
  hasBoldMarkdown,
  hasItalicMarkdown,
  hasStrikethroughMarkdown,
} from '../transforms';

function getBoldData() {
  return {
    isMod: true,
    key: 'b'
  }
}
function getItalicData() {
  return {
    isMod: true,
    key: 'i'
  }
}
function getStrikethroughData() {
  return {
    isMod: true,
    key: 's'
  }
}
function getOtherData() {
  return {
    isMod: false
  }
}
function getLineBreakEvent() {
  return {
    keyCode: 13,
    preventDefault() {

    },
    stopPropagation() {

    }
  }
}
function getOtherEvent() {
  return {
    keyCode: 65,
    preventDefault() {

    },
    stopPropagation() {

    }
  }
}

describe('plain editor shortcuts', () => {
  describe('split line', () => {
    it('split simple line', () => {
      const text = 'plain text';
      let state = deserialize(text).transform().
      moveOffsetsTo('plain'.length, 'plain'.length).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = `plain\n text`;
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('split unordered list\'s line', () => {
      const text = '* item item';
      let state = deserialize(text).transform().
      moveOffsetsTo('* item '.length, '* item '.length).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = `* item \n* item`;
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('split ordered list\'s line', () => {
      const text = '3. item item';
      let state = deserialize(text).transform().
      moveOffsetsTo('3. item '.length, '3. item '.length).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = `3. item \n4. item`;
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('add item to ordered list', () => {
      const text = '1. item\n2. item\n3. item\n';
      const pos = '1. item\n2. item\n3. item'.length;
      let state = deserialize(text).transform().
      moveOffsetsTo(pos, pos).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = '1. item\n2. item\n3. item\n4. \n';
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('close ordered list', () => {
      const text = '1. item\n2. item\n3. \n';
      const pos = '1. item\n2. item\n3. '.length;
      let state = deserialize(text).transform().
      moveOffsetsTo(pos, pos).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = '1. item\n2. item\n\n\n';
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('add item to unordered list', () => {
      const text = '+ item\n+ item\n+ item\n';
      const pos = '+ item\n+ item\n+ item'.length;
      let state = deserialize(text).transform().
      moveOffsetsTo(pos, pos).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = '+ item\n+ item\n+ item\n+ \n';
      expect(Plain.serialize(newState)).to.equal(result);
    });

    it('close unordered list', () => {
      const text = '+ item\n+ item\n+ \n';
      const pos = '+ item\n+ item\n+ '.length;
      let state = deserialize(text).transform().
      moveOffsetsTo(pos, pos).apply();
      let newState = shortcuts(getLineBreakEvent(), {}, state);
      let result = '+ item\n+ item\n\n\n';
      expect(Plain.serialize(newState)).to.equal(result);
    });
  });

  describe('press ctrl + b', () => {
    it('unwrap bold without selection', () => {
      const text = '**bold text**';
      let state = deserialize(text).transform().
      moveOffsetsTo('**bold'.length, '**bold'.length).apply();
      expect(hasBoldMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getBoldData(), state);
      let result = 'bold text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasBoldMarkdown(newState)).to.equal(false);
    });

    it('unwrap bold with all selection', () => {
      const text = '**bold text**';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, text.length).apply();
      expect(hasBoldMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getBoldData(), state);
      let result = 'bold text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasBoldMarkdown(newState)).to.equal(false);
    });

    it('wrap bold with selection', () => {
      const text = 'bold text';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, 'bold'.length).apply();
      expect(hasBoldMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getBoldData(), state);
      let result = '**bold** text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasBoldMarkdown(newState)).to.equal(true);
    });

    it('wrap bold without selection', () => {
      const text = 'bold text';
      let state = deserialize(text).transform().
      moveOffsetsTo('bold'.length, 'bold'.length).apply();
      expect(hasBoldMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getBoldData(), state);
      let result = 'bold**** text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasBoldMarkdown(newState)).to.equal(true);
    });
  });

  describe('press ctrl + i', () => {
    it('unwrap italic without selection', () => {
      const text = '_italic text_';
      let state = deserialize(text).transform().
      moveOffsetsTo('_italic'.length, '_italic'.length).apply();
      expect(hasItalicMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getItalicData(), state);
      let result = 'italic text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasItalicMarkdown(newState)).to.equal(false);
    });

    it('unwrap italic with all selection', () => {
      const text = '_italic text_';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, text.length).apply();
      expect(hasItalicMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getItalicData(), state);
      let result = 'italic text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasItalicMarkdown(newState)).to.equal(false);
    });

    it('wrap italic with selection', () => {
      const text = 'italic text';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, 'italic'.length).apply();
      expect(hasItalicMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getItalicData(), state);
      let result = '_italic_ text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasItalicMarkdown(newState)).to.equal(true);
    });

    it('wrap italic without selection', () => {
      const text = 'italic text';
      let state = deserialize(text).transform().
      moveOffsetsTo('italic'.length, 'italic'.length).apply();
      expect(hasItalicMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getItalicData(), state);
      newState = newState.transform().insertText(' ').focus().apply();
      let result = 'italic_ _ text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasItalicMarkdown(newState)).to.equal(true);
    });
  });

  describe('press ctrl + s', () => {
    it('unwrap strikethrough without selection', () => {
      const text = '~~strikethrough text~~';
      let state = deserialize(text).transform().
      moveOffsetsTo('~~strikethrough'.length, '~~strikethrough'.length).apply();
      expect(hasStrikethroughMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getStrikethroughData(), state);
      let result = 'strikethrough text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasStrikethroughMarkdown(newState)).to.equal(false);
    });

    it('unwrap strikethrough with all selection', () => {
      const text = '~~strikethrough text~~';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, text.length).apply();
      expect(hasStrikethroughMarkdown(state)).to.equal(true);
      let newState = shortcuts(getOtherEvent(), getStrikethroughData(), state);
      let result = 'strikethrough text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasStrikethroughMarkdown(newState)).to.equal(false);
    });

    it('wrap strikethrough with selection', () => {
      const text = 'strikethrough text';
      let state = deserialize(text).transform().
      moveOffsetsTo(0, 'strikethrough'.length).apply();
      expect(hasStrikethroughMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getStrikethroughData(), state);
      let result = '~~strikethrough~~ text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasStrikethroughMarkdown(newState)).to.equal(true);
    });

    it('wrap strikethrough without selection', () => {
      const text = 'strikethrough text';
      let state = deserialize(text).transform().
      moveOffsetsTo('strikethrough'.length, 'strikethrough'.length).apply();
      expect(hasStrikethroughMarkdown(state)).to.equal(false);
      let newState = shortcuts(getOtherEvent(), getStrikethroughData(), state);
      let result = 'strikethrough~~~~ text';
      expect(Plain.serialize(newState)).to.equal(result);
      expect(hasStrikethroughMarkdown(newState)).to.equal(true);
    });
  });

  describe('press other key', () => {
    it('press key', () => {
      const text = '~~strikethrough text~~';
      let state = deserialize(text).transform().
      moveOffsetsTo('~~strikethrough'.length, '~~strikethrough'.length).apply();
      let result = shortcuts(getOtherEvent(), getOtherData(), state);
      expect(result).to.be.undefined; // eslint-disable-line
    });
  });
});
