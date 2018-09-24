import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import LinkButton from '../LinkButton';
import getMessage from '../../../translations';

describe('<LinkButton/>', () => {
  it('check default button', () => {
    const component = <LinkButton onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.btn')).to.have.length(1);
    expect(wrapper.find(`.btn-default`)).to.have.length(1);
    expect(wrapper.find('.fa')).to.have.length(1);
    expect(wrapper.find(`.fa-link`)).to.have.length(1);
    expect(wrapper.find(`[title="${getMessage('en', 'insertLink')}"]`)).to.have.length(1);
    const props = component.props;
    expect(props.disabled).to.equal(false);
    expect(props.locale).to.equal('en');
  });

  it('click on the button', () => {
    const handleClick = sinon.spy();
    const component = <LinkButton onClick={handleClick} />;
    const wrapper = shallow(component);
    wrapper.find('button').simulate('click');
    expect(handleClick.callCount).to.equal(1);
  });
});
