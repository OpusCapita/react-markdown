import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import HeaderButton from '../HeaderButton';

describe('<HeaderButton/>', () => {
  it('check button', () => {
    const level = 1;
    const component = <HeaderButton level={level} onClick={() => {}} />;
    const wrapper = shallow(component);
    expect(wrapper.find('strong')).to.have.length(1);
    expect(wrapper.find('strong').text()).to.equal('Header 1');
    const props = component.props;
    expect(props.level).to.equal(1);
  });

  it('click on the button', () => {
    const level = 2;
    const handleClick = sinon.spy();
    const component = <HeaderButton level={level} onClick={handleClick} />;
    const wrapper = shallow(component);
    wrapper.find('MenuItem').simulate('click');
    expect(handleClick.callCount).to.equal(1);
    expect(handleClick.calledWith(level)).to.equal(true);
  });
});
