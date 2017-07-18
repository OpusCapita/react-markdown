import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Plain } from 'slate'
import MarkdownLinkButton from '../MarkdownLinkButton';

describe('<MarkdownLinkButton/>', () => {
  it('check insert link into selected text', () => {
    let state = Plain.deserialize("some text").
    // selected 'text' in state
    transform().moveOffsetsTo('some '.length, 'some text'.length).apply();
    const wrapper = shallow(<MarkdownLinkButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect('some [text](http://example.com)').to.equal(Plain.serialize(state));
    expect('some [text]('.length).to.equal(state.selection.startOffset);
    expect('some [text](http://example.com'.length).to.equal(state.selection.endOffset);
  });

  it('check insert link into cursor', () => {
    let state = Plain.deserialize('some text').
    // selected 'text' in state
    transform().move('some text'.length).apply();
    const wrapper = shallow(<MarkdownLinkButton state={state} onChange={(newState) => { state = newState }} />);
    wrapper.find('button').simulate('click');
    expect('some text[link text](http://example.com)').to.equal(Plain.serialize(state));
    expect('some text['.length).to.equal(state.selection.startOffset);
    expect('some text[link text](http://example.com'.length).to.equal(state.selection.endOffset);
  });
});
