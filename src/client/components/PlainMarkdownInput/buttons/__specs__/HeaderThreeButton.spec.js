import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import HeaderThreeButton from '../HeaderThreeButton';

describe('<HeaderThreeButton/>', () => {
  it('check active button', () => {
    const state = Plain.deserialize("### some text");
    const wrapper = shallow(<HeaderThreeButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(1);
  });

  it('check inactive button', () => {
    const state = Plain.deserialize("some text");
    const wrapper = shallow(<HeaderThreeButton state={state} onChange={() => {}} />);
    expect(wrapper.find('.active')).to.have.length(0);
  });

  it('check unwrap header', () => {
    let state = Plain.deserialize("### some text");
    const wrapper = shallow(<HeaderThreeButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('some text');
  });

  it('check replace header', () => {
    let state = Plain.deserialize("# some text");
    const wrapper = shallow(<HeaderThreeButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect(Plain.serialize(state)).to.equal('### some text');
  });
});
