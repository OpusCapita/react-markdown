import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
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
  it('componentWillReceiveProps(nextProps)', () => {
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.cancelAdjustPosition = sinon.spy();
    wrapperInstance.adjustPosition = sinon.spy();
    wrapperInstance.componentWillReceiveProps();
    expect(wrapperInstance.cancelAdjustPosition.callCount).to.equal(1);
    expect(wrapperInstance.adjustPosition.callCount).to.equal(1);
  });

  it('componentWillUpdate(nextProps)', () => {
    const selectedItem = 2;
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.containerRef = { scrollTop: 25 };
    wrapperInstance['itemRef2'] = { offsetTop: 50 };
    wrapperInstance.componentWillUpdate({ selectedItem });
    expect(wrapperInstance.containerRef.scrollTop).to.equal(25);

    wrapper.setProps({ selectedItem: 3 });
    wrapperInstance.containerRef = { scrollTop: 25 };
    wrapperInstance['itemRef2'] = { offsetTop: 50 };
    wrapperInstance.componentWillUpdate({ selectedItem });
    expect(wrapperInstance.containerRef.scrollTop).to.equal(24);

    wrapper.setProps({ selectedItem: 1 });
    wrapperInstance.containerRef = { scrollTop: 25 };
    wrapperInstance['itemRef2'] = { offsetTop: 200 };
    wrapperInstance.componentWillUpdate({ selectedItem });
    expect(wrapperInstance.containerRef.scrollTop).to.equal(44);
  });

  it('componentWillUnmount()', () => {
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance._animationFrame = sinon.spy();
    wrapperInstance.componentWillUnmount();
    expect(wrapperInstance._animationFrame.callCount).to.equal(1);
  });

  it('setPosition(selection)', () => {
    window.requestAnimationFrame = sinon.spy();
    let restrictorRef = {
      offsetWidth: 800,
      getBoundingClientRect() {
        return {
          left: 255,
          top: 500
        };
      }
    };
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    wrapper.setProps({ restrictorRef });
    let wrapperInstance = wrapper.instance();
    wrapperInstance.containerRef = {
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

  it('adjustPosition()', () => {
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.requestAnimationFrame = sinon.spy();
    wrapperInstance.adjustPosition();
    expect(wrapperInstance.requestAnimationFrame.callCount).to.equal(0);
  });

  it('cancelAdjustPosition()', () => {
    let component = (
      <AutocompleteWidget
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.cancelAdjustPosition();
    wrapperInstance._animationFrame = sinon.spy();
    wrapperInstance.cancelAdjustPosition();
    expect(wrapperInstance._animationFrame.callCount).to.equal(1);
  });

  it('render() with empty items', () => {
    let component = (
      <AutocompleteWidget
        items={null}
        selectedItem={0}
        onMouseDown={() => {}}
      />
    );
    expect(component.props.items).to.equal(null);
  });
});
