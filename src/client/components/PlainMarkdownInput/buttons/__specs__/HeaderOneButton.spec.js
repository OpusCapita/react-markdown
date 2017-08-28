import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from '@opuscapita/slate';
import HeaderOneButton from '../HeaderOneButton';
import deserialize from '../../slate/deserialize';
import { createCustomCharacters } from '../../slate/schema';

describe('<HeaderOneButton/>', () => {
  it('check unwrap header', () => {
    let state = createCustomCharacters(deserialize("# some text"));
    // let state = Plain.deserialize("# some text");
    const wrapper = shallow(<HeaderOneButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.simulate('click');
    expect(Plain.serialize(state)).to.equal('some text');
  });

  it('check replace header', () => {
    let state = createCustomCharacters(deserialize("## some text"));
    // let state = Plain.deserialize("## some text");
    const wrapper = shallow(<HeaderOneButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.simulate('click');
    expect(Plain.serialize(state)).to.equal('# some text');
  });
});
