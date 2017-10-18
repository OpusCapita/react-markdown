import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ObjectReferenceButton from '../ObjectReferenceButton';

describe('<ObjectReferenceButton/>', () => {
  it('check default button', () => {
    const extension = {};
    const component = <ObjectReferenceButton extension={extension} />;
    const wrapper = shallow(component);
    expect(wrapper.find('.btn')).to.have.length(1);
    expect(wrapper.find(`.btn-default`)).to.have.length(1);
    const props = component.props;
    expect(props.disabled).to.equal(false);
  });

  it('click on the button', () => {
    let extensions=[
      {
        objectClassName: 'Product',
        specialCharacter: '#',
        color: '#9ed69e',
        termRegex: /^\#(\w*)$/,
        searchItems(term) {
          const items = [
            {_objectLabel: 'a1'},
            {_objectLabel: 'a2'},
            {_objectLabel: 'a23'},
            {_objectLabel: 'b1'},
          ];
          return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
        },
        markdownText(item) {
          return '#' + item._objectLabel;
        }
      },
    {
      objectClassName: 'Term',
        specialCharacter: '$',
      color: '#f396c3',
      termRegex: /^\$(\w*)$/,
      searchItems(term) {
      const items = [
        {_objectLabel: 'a1'},
        {_objectLabel: 'a2'},
        {_objectLabel: 'a23'},
      ];
      return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
    },
      markdownText(item) {
      return '$' + item._objectLabel;
    }
    }
  ];

    let handleClick = sinon.spy();
    const component = <ObjectReferenceButton extension={extensions} onClick={handleClick} />;
    const wrapper = shallow(component);
    wrapper.find('button').simulate('click');
    expect(handleClick.callCount).to.equal(1);
    expect(handleClick.calledWith(extensions)).to.equal(true);
  });
});
