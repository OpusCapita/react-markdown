import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import ItalicButton from '../ItalicButton';

describe('<ItalicButton/>', () => {
  it('check active button', () => {
    const state = Plain.deserialize("some _text_").
      // selected 'text' in state
    transform().moveOffsetsTo('some _'.length, 'some _text'.length).apply();
    const wrapper = shallow(<ItalicButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(1);
  });

  it('check mark selected text', () => {
    let state = Plain.deserialize("some text").
    // selected 'text' in state
    transform().moveOffsetsTo('some '.length, 'some text'.length).apply();
    const wrapper = shallow(<ItalicButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some _text_');
  });

  it('check unmark selected text', () => {
    let state = Plain.deserialize("some _text_").
    // selected 'text' in state
    transform().moveOffsetsTo('some _'.length, 'some _text'.length).apply();
    const wrapper = shallow(<ItalicButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some text');
  });

  it('check enabled button', () => {
    let state = Plain.deserialize("some _text_\nnext line");
    const wrapper = shallow(<ItalicButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(0);
  });

  it('check disabled button', () => {
    let state = Plain.deserialize("some _text_\nnext line").
    // select all text
    transform().selectAll().apply();
    const wrapper = shallow(<ItalicButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(1);
  });
});
