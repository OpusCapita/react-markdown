import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from 'slate'
import MarkdownBoldButton from '../MarkdownBoldButton';

describe('<MarkdownBoldButton/>', () => {
  it('check active button', () => {
    const state = Plain.deserialize("some text **bold text**").
      // selected 'bold text' in state
    transform().moveOffsetsTo('some text **'.length, 'some text **bold text'.length).apply();
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(1);
  });

  it('check inactive button', () => {
    const state = Plain.deserialize("some text **bold text**").
      // selected 'bold' in state
    transform().moveOffsetsTo('some text **'.length, 'some text **bold'.length).apply();
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(0);
  });

  it('check mark selected text', () => {
    let state = Plain.deserialize("some text bold text").
    // selected 'bold text' in state
    transform().moveOffsetsTo('some text '.length, 'some text bold text'.length).apply();
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some text **bold text**');
  });

  it('check unmark selected text', () => {
    let state = Plain.deserialize("some text **bold text**").
    // selected 'bold text' in state
    transform().moveOffsetsTo('some text **'.length, 'some text **bold text'.length).apply();
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some text bold text');
  });

  it('check enabled button', () => {
    let state = Plain.deserialize("some text **bold text**\nnext line");
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(0);
  });

  it('check disabled button', () => {
    let state = Plain.deserialize("some text **bold text**\nnext line").
    // select all text
    transform().selectAll().apply();
    const wrapper = shallow(<MarkdownBoldButton state={state} onChange={() => {}} />);
    expect(wrapper.find('button[disabled=true]')).to.have.length(1);
  });
});
