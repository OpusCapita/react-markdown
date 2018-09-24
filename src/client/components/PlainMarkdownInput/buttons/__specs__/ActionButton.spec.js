import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ActionButton from '../ActionButton';
import getMessage from '../../../translations';

describe('<ActionButton/>', () => {
  it('check default button', () => {
    const accent = 'bold';
    const component = <ActionButton accent={accent} onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.active')).to.have.length(0);
    expect(wrapper.find('.fa')).to.have.length(1);
    expect(wrapper.find(`.fa-${accent}`)).to.have.length(1);
    expect(wrapper.find(`[title="${getMessage('en', accent)}"]`)).to.have.length(1);
    const props = component.props;
    expect(props.active).to.equal(false);
    expect(props.disabled).to.equal(false);
    expect(props.locale).to.equal('en');
  });

  it('check active button', () => {
    const component = <ActionButton active={true} accent="bold" onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.active')).to.have.length(1);
    const props = component.props;
    expect(props.active).to.equal(true);
  });

  it('click on the button', () => {
    const accent = 'bold';
    const handleClick = sinon.spy();
    const component = <ActionButton active={true} accent={accent} onClick={handleClick} />;
    const wrapper = shallow(component);
    wrapper.find('button').simulate('click');
    expect(handleClick.callCount).to.equal(1);
    expect(handleClick.calledWith(accent)).to.equal(true);
  });

  it('check bulletedList button', () => {
    const component = <ActionButton accent="ul" onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.active')).to.have.length(0);
    expect(wrapper.find('.fa')).to.have.length(1);
    expect(wrapper.find('.fa-list-ul')).to.have.length(1);
    expect(wrapper.find(`[title="${getMessage('en', 'bulletedList')}"]`)).to.have.length(1);
  });

  it('check numberedList button', () => {
    const component = <ActionButton accent="ol" onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.active')).to.have.length(0);
    expect(wrapper.find('.fa')).to.have.length(1);
    expect(wrapper.find('.fa-list-ol')).to.have.length(1);
    expect(wrapper.find(`[title="${getMessage('en', 'numberedList')}"]`)).to.have.length(1);
  });
});
