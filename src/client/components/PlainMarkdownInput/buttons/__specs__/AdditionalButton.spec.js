import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AdditionalButton from '../AdditionalButton';

describe('<AdditionalButton/>', () => {
  it('check default button', () => {
    const settings = {};
    const component = <AdditionalButton settings={settings}/>;
    const wrapper = shallow(component);
    expect(wrapper.find('.btn')).to.have.length(1);
    expect(wrapper.find(`.btn-default`)).to.have.length(1);
    const props = component.props;
    expect(props.disabled).to.equal(false);
  });

  it('click on the button', () => {
    let settings = {
      iconElement: (<i className="fa fa-search"></i>),
      handleButtonPress({ value, insertAtCursorPosition }) {
        insertAtCursorPosition('#Product.new');
      },
      label: 'Product'
    };

    let handleClick = sinon.spy();
    const component = <AdditionalButton settings={settings} onClick={handleClick}/>;
    const wrapper = shallow(component);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('.fa')).to.have.length(1);
    expect(wrapper.find('.fa-search')).to.have.length(1);
    expect(handleClick.callCount).to.equal(1);
    expect(handleClick.calledWith(settings.handleButtonPress)).to.equal(true);
  });
});
