import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AutocompleteWidget from './AutocompleteWidget';

function contains(className) {
  return this.classes.indexOf(className) !== -1;
}

let slateEditor = {
  id: 'react-markdown--slate-content',
  classList: {
    classes: ['react-markdown--slate-content'],
    contains
  },
  scrollTop: 100,
  offsetHeight: 220,
  style: {

  }
};
let target = {
  id: 'target_elem',
  classList: {
    classes: ['target_elem'],
    contains
  },
  parentElement: slateEditor
};
let parent1 = {
  id: 'parent_1',
  classList: {
    classes: ['parent_1'],
    contains
  },
  parentElement: target
};
let parent = {
  id: 'parent',
  classList: {
    classes: ['parent'],
    contains
  },
  parentElement: parent1
};
let elem = {
  parentElement: parent,
  offsetTop: 177
};
let selection = {
  anchorNode: {
    parentNode: elem
  },
  getRangeAt() {
    return {
      getBoundingClientRect() {
        return {
          left: 1316,
          top: 371,
          bottom: 388
        };
      }
    };
  }
};

window.cancelAnimationFrame = callback => {
  callback();
};

window.requestAnimationFrame = callback => callback;

describe('<AutocompleteWidget />', () => {
  it.skip('+ componentDidMount()', () => {
    const handler = sinon.spy();
    const listener = sinon.spy();
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
        onScroll={handler}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.adjustPosition = sinon.spy();
    wrapperInstance['items-ref'] = { addEventListener: listener };
    wrapperInstance.componentDidMount();
    expect(listener.callCount).to.equal(1);
    expect(listener.getCall(0).args[0]).to.equal('scroll');
    expect(listener.getCall(0).args[1]).to.equal(handler);
    expect(listener.getCall(0).args[2]).to.equal(false);
  });

  it.skip('+ componentWillReceiveProps(nextProps)', () => {
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.cancelAdjustPosition = sinon.spy();
    wrapperInstance.adjustPosition = sinon.spy();
    wrapperInstance.componentWillReceiveProps();
    expect(wrapperInstance.cancelAdjustPosition.callCount).to.equal(1);
    expect(wrapperInstance.adjustPosition.callCount).to.equal(1);
  });

  it.skip('+ componentWillUpdate(nextProps)', () => {
    const selectedIndex = 2;
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance['items-ref'] = { scrollTop: 25 };
    wrapperInstance['item-ref-2'] = { offsetTop: 50 };
    wrapperInstance.componentWillUpdate({ selectedIndex });
    expect(wrapperInstance['items-ref'].scrollTop).to.equal(25);

    wrapper.setProps({ selectedIndex: 3 });
    wrapperInstance['items-ref'] = { scrollTop: 25 };
    wrapperInstance['item-ref-2'] = { offsetTop: 50 };
    wrapperInstance.componentWillUpdate({ selectedIndex });
    expect(wrapperInstance['items-ref'].scrollTop).to.equal(24);

    wrapper.setProps({ selectedIndex: 1 });
    wrapperInstance['items-ref'] = { scrollTop: 25 };
    wrapperInstance['item-ref-2'] = { offsetTop: 200 };
    wrapperInstance.componentWillUpdate({ selectedIndex });
    expect(wrapperInstance['items-ref'].scrollTop).to.equal(44);
  });

  it.skip('+ componentWillUnmount()', () => {
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance._animationFrame = sinon.spy();
    wrapperInstance.componentWillUnmount();
    expect(wrapperInstance._animationFrame.callCount).to.equal(1);
  });

  it.skip('+ setPosition(selection)', () => {
    window.requestAnimationFrame = sinon.spy();
    let restrictorRef = {
      offsetWidth: 800,
      getBoundingClientRect() {
        return {
          left: 255,
          top: 500
        }
      }
    };
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    wrapper.setProps({ restrictorRef });
    let wrapperInstance = wrapper.instance();
    wrapperInstance['items-ref'] = {
      offsetHeight: 500,
      offsetWidth: 300
    };
    wrapperInstance.setPosition(selection);
    expect(window.requestAnimationFrame.callCount).to.equal(1);
    expect(slateEditor.style.overflow).to.equal('hidden');
    expect(wrapper.state('left')).to.equal(`761px`);
    expect(wrapper.state('top')).to.equal(`0px`);

    restrictorRef = {
      offsetWidth: 792,
      getBoundingClientRect() {
        return {
          left: 1300,
          top: 200
        }
      }
    };
    wrapper.setProps({ restrictorRef });
    slateEditor.scrollTop = 0;
    slateEditor.offsetHeight = 736;
    wrapperInstance['items-ref'] = {
      offsetHeight: 160,
      offsetWidth: 27
    };
    wrapperInstance.setPosition(selection);
    expect(window.requestAnimationFrame.callCount).to.equal(2);
    expect(wrapper.state('left')).to.equal(`16px`);
    expect(wrapper.state('top')).to.equal(`192px`);
  });

  it.skip('+ adjustPosition()', () => {
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.requestAnimationFrame = sinon.spy();
    wrapperInstance.adjustPosition();
    expect(wrapperInstance.requestAnimationFrame.callCount).to.equal(0);
  });

  it.skip('+ cancelAdjustPosition()', () => {
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.cancelAdjustPosition();
    wrapperInstance._animationFrame = sinon.spy();
    wrapperInstance.cancelAdjustPosition();
    expect(wrapperInstance._animationFrame.callCount).to.equal(1);
  });

  it.skip('+ handleSelectItem(index)', () => {
    let handler = sinon.spy();
    let index = 2;
    let component = (
      <AutocompleteWidget
        selectedIndex={0}
        onMouseDown={() => {}}
        onSelectItem={handler}
      />
    );
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleSelectItem(index);
    expect(handler.callCount).to.equal(1);
    expect(handler.getCall(0).args[0]).to.equal(index);
  });

  it('render() with empty items', () => {
    let component = (
      <AutocompleteWidget
        items={null}
        selectedIndex={0}
        onMouseDown={() => {}}
      />
    );
    expect(component.props.items).to.equal(null);
  });
});
