import { expect } from 'chai';
import {
  autoScrollToTop,
  getSlateEditor,
  getClosestElemFromClass
} from './utils';

function contains(className) {
  return this.classes.indexOf(className) !== -1;
}

const slateEditor = {
  id: 'react-markdown--slate-content',
  classList: {
    classes: ['react-markdown--slate-content'],
    contains
  },
  scrollTop: 100,
  offsetHeight: 220
};
const target = {
  id: 'target_elem',
  classList: {
    classes: ['target_elem'],
    contains
  },
  parentElement: slateEditor
};
const parent1 = {
  id: 'parent_1',
  classList: {
    classes: ['parent_1'],
    contains
  },
  parentElement: target
};
const parent = {
  id: 'parent',
  classList: {
    classes: ['parent'],
    contains
  },
  parentElement: parent1
};
const elem = {
  parentElement: parent,
  offsetTop: 500
};
const selection = {
  anchorNode: {
    parentNode: elem
  }
};

describe('plain editor utils', () => {
  it('getClosestElemFromClass(elem, className)', () => {
    let targetElem = getClosestElemFromClass(elem, 'react-markdown--slate-content');
    expect(targetElem.id).to.equal('react-markdown--slate-content');

    const newElem = {};
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
});
