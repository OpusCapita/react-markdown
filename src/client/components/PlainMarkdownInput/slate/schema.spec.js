/* eslint-disable max-len */

import React from 'react';
import schema from './schema'
const { rules } = schema;
const decorate = rules[0].decorate;
const render = rules[0].render;
import PlainMarkdownInput from '../PlainMarkdownInput.react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { parse } from './tokenizer';
import { Mark, Character, Text } from 'slate';
import { Set as ImmutableSet, List as ImmutableList } from 'immutable';

function getCharacter(char) {
  return Character.create({
    marks: new ImmutableSet(),
    text: char
  });
}
function getText(charactersList, text, key) {
  return Text.create({
    characters: ImmutableList(charactersList),
    text,
    key
  });
}

describe('plain editor schema', () => {
  it('call markdownDecorator', () => {
    const nodeText = '# Header1';
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);

    let wrapper = mount(component);
    let editorState = wrapper.state('editorState');

    let nodes = editorState.document.nodes.asMutable();
    let nodesSize = nodes.size;
    expect(nodesSize).to.equal(1);

    const currNode = nodes.get(0).asMutable();
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
    expect(currNode.text).to.equal(nodeText);

    let nodeTextArr = nodeText.split('');
    let charactersList = nodeTextArr.map(el => getCharacter(el));

    let text = getText(charactersList, nodeText, '1');

    let characters = decorate(text, currNode);
    expect(text.charsData.text).to.equal(nodeText);
    expect(characters.size).to.equal(nodeText.length);

    nodeTextArr.forEach((el, ind) => {
      expect(characters.get(ind).toJSON()).to.deep.equal({
        "kind": "character",
        "marks": [{ "data": {}, "kind": "mark", "type": "header1" }],
        "text": el
      });
    });
    nodeTextArr.forEach((el, ind) => {
      expect(text.charsData.characters.get(ind).toJSON()).to.deep.equal({
        "kind": "character",
        "marks": [{ "data": {}, "kind": "mark", "type": "header1" }],
        "text": el
      });
    });

    characters = decorate(text, currNode);
    expect(text.charsData.text).to.equal(nodeText);
    expect(characters.size).to.equal(nodeText.length);

    nodeTextArr.forEach((el, ind) => {
      expect(characters.get(ind).toJSON()).to.deep.equal({
        "kind": "character",
        "marks": [{ "data": {}, "kind": "mark", "type": "header1" }],
        "text": el
      });
    });
    nodeTextArr.forEach((el, ind) => {
      expect(text.charsData.characters.get(ind).toJSON()).to.deep.equal({
        "kind": "character",
        "marks": [{ "data": {}, "kind": "mark", "type": "header1" }],
        "text": el
      });
    });
  });

  it('call markdownDecorator for block without data.text', () => {
    const nodeText = '# Header1';
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);

    let wrapper = mount(component);
    let editorState = wrapper.state('editorState');

    let nodes = editorState.document.nodes.asMutable();
    const currNode = nodes.get(0).asMutable();
    currNode.data = undefined;

    let nodeTextArr = nodeText.split('');
    let charactersList = nodeTextArr.map(el => getCharacter(el));

    let text = getText(charactersList, nodeText, '1');
    let characters = decorate(text, currNode);
    nodeTextArr.forEach((el, ind) => {
      expect(characters.get(ind).toJSON()).to.deep.equal({
        "kind": "character",
        "marks": [],
        "text": el
      });
    });
  });

  it('call rendererComponent() for props.node.type === `line`', () => {
    const children = '**bold**';
    const props = {
      children,
      node: {
        type: 'line'
      }
    };
    let component = render(props);
    let wrapper = shallow(component);
    expect(wrapper.hasClass('oc-md-hl-block')).to.equal(true);
  });

  it('call rendererComponent() for props.node.type !== `line`', () => {
    const mark = Mark.create({ type: 'bold' });
    const children = '**bold**';
    const props = {
      children,
      mark,
      node: {
        type: 'range'
      }
    };
    let component = render(props);
    let wrapper = shallow(component);
    expect(wrapper.hasClass('oc-md-hl-bold')).to.equal(true);
  });

  it('call rendererComponent() for props.node.type !== `line` without mark', () => {
    const children = '**bold**';
    const props = {
      children,
      node: {
        type: 'range'
      }
    };
    let component = render(props);
    expect(component).to.equal(null);
  });
});
