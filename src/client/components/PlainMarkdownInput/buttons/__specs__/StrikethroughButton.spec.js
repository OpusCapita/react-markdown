import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import StrikethroughButton from '../StrikethroughButton';
import deserialize from '../../slate/deserialize';
import { createCustomCharacters } from '../../slate/schema';

describe('<StrikethroughButton/>', () => {
  it('check active button', () => {
    const state = createCustomCharacters(deserialize("some ~~text~~").
      // selected 'text' in state
    transform().moveOffsetsTo('some ~~'.length, 'some ~~text'.length).apply());
    const wrapper = shallow(<StrikethroughButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(1);
  });

  it('check mark selected text', () => {
    let state = createCustomCharacters(deserialize("some text").
    // selected 'text' in state
    transform().moveOffsetsTo('some '.length, 'some text'.length).apply());
    const wrapper = shallow(
      <StrikethroughButton state={state} onChange={(newState) => { state = newState }} />
    );
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some ~~text~~');
  });

  it('check unmark selected text', () => {
    let state = createCustomCharacters(deserialize("some ~~text~~").
    // selected 'text' in state
    transform().moveOffsetsTo('some ~~'.length, 'some ~~text'.length).apply());
    const wrapper = shallow(
      <StrikethroughButton state={state} onChange={(newState) => { state = newState }} />
    );
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some text');
  });

  it('check enabled button', () => {
    let state = deserialize("some ~~text~~\nnext line");
    const wrapper = shallow(<StrikethroughButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(0);
  });

  it('check disabled button', () => {
    let state = deserialize("some ~~text~~\nnext line").
    // select all text
    transform().selectAll().apply();
    const wrapper = shallow(<StrikethroughButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(1);
  });
});
