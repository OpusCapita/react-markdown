import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Plain from 'slate-plain-serializer';
import HeaderFiveButton from '../HeaderFiveButton';

describe('<HeaderFiveButton/>', () => {
  it('check unwrap header', () => {
    let state = Plain.deserialize("##### some text");
    const wrapper = shallow(<HeaderFiveButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.simulate('click');
    expect(Plain.serialize(state)).to.equal('some text');
  });

  it('check replace header', () => {
    let state = Plain.deserialize("# some text");
    const wrapper = shallow(<HeaderFiveButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.simulate('click');
    expect(Plain.serialize(state)).to.equal('##### some text');
  });
});
