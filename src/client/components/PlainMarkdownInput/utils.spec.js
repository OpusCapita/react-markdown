import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import PlainMarkdownInput from '../PlainMarkdownInput';
import Plain from 'slate-plain-serializer';
import {
  autoScrollToTop,
  getSlateEditor,
  getClosestElemFromClass,
  addSpecialCharacter
} from './utils';

function contains(className) {
  return this.classes.indexOf(className) !== -1;
}

let slateEditor = {
  id: 'react-markdown--slate-content',
  classList: {
    classes: ['react-markdown--slate-content'],
    contains
  },
  scrollTop: 100,
  offsetHeight: 220
};
let target = {
  id: 'target_elem',
  classList: {
    classes: ['target_elem'],
    contains
  },
  parentElement: slateEditor
};
let parent1 = {
  id: 'parent_1',
  classList: {
    classes: ['parent_1'],
    contains
  },
  parentElement: target
};
let parent = {
  id: 'parent',
  classList: {
    classes: ['parent'],
    contains
  },
  parentElement: parent1
};
let elem = {
  parentElement: parent,
  offsetTop: 500
};
let selection = {
  anchorNode: {
    parentNode: elem
  }
};

describe('plain editor utils', () => {
  it('getClosestElemFromClass(elem, className)', () => {
    let targetElem = getClosestElemFromClass(elem, 'react-markdown--slate-content');
    expect(targetElem.id).to.equal('react-markdown--slate-content');

    let newElem = {};
    targetElem = getClosestElemFromClass(newElem, 'target_elem');
    expect(targetElem).to.equal(null);
  });

  it('getSlateEditor(selection)', () => {
    let slateEditor1 = getSlateEditor(selection);
    expect(slateEditor1.id).to.equal('react-markdown--slate-content');

    elem.closest = () => slateEditor;
    slateEditor1 = getSlateEditor(selection);
    expect(slateEditor1.id).to.equal('react-markdown--slate-content');

    delete elem.closest;
  });

  it('autoScrollToTop()', () => {
    const getSelection = window.getSelection;
    window.getSelection = () => selection;
    autoScrollToTop();
    expect(slateEditor.scrollTop).to.equal(300);
    autoScrollToTop();
    expect(slateEditor.scrollTop).to.equal(300);

    window.getSelection = () => ({});
    autoScrollToTop();
    expect(slateEditor.scrollTop).to.equal(300);

    if (getSelection) {
      window.getSelection = getSelection;
    } else {
      delete window.getSelection;
    }
  });

  it('addSpecialCharacter(specialCharacter, state)', () => {
    let specialCharacter = '#';
    let nodeText = 'Simple text';
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={false}
      readOnly={false}
    />);

    let wrapper = shallow(component);
    let editorState = wrapper.state('editorState');
    let change = editorState.change();
    change.moveOffsetsTo(nodeText.length - 1, nodeText.length - 1);
    let newState = addSpecialCharacter(specialCharacter, change.state);
    expect(Plain.serialize(newState)).to.equal('Simple #text');

    change.moveOffsetsTo(nodeText.length, nodeText.length);
    newState = addSpecialCharacter(specialCharacter, change.state);
    expect(Plain.serialize(newState)).to.equal('Simple text #');
  });
});
