// import React from 'react';
// import { shallow } from 'enzyme';
// import { expect } from 'chai';
// import Plain from 'slate-plain-serializer';
// import OrderedListButton from '../OrderedListButton';
//
// describe('<OrderedListButton/>', () => {
//   it('check active button', () => {
//     const state = Plain.deserialize("1. some text");
//     const wrapper = shallow(<OrderedListButton state={state} onChange={() => {}} />);
//     expect(wrapper.find('.active')).to.have.length(1);
//   });
//
//   it('check inactive button', () => {
//     const state = Plain.deserialize("some text");
//     const wrapper = shallow(<OrderedListButton state={state} onChange={() => {}} />);
//     expect(wrapper.find('.active')).to.have.length(0);
//   });
//
//   it('check unwrap header', () => {
//     let state = Plain.deserialize("1. some text");
//     const wrapper = shallow(<OrderedListButton state={state} onChange={(newState) => { state = newState }} />);
//     wrapper.find('button').simulate('click');
//     expect(Plain.serialize(state)).to.equal('some text');
//   });
//
//   it('check replace header', () => {
//     let state = Plain.deserialize("* some text");
//     const wrapper = shallow(<OrderedListButton state={state} onChange={(newState) => { state = newState }} />);
//     wrapper.find('button').simulate('click');
//     expect(Plain.serialize(state)).to.equal('1. some text');
//   });
// });
