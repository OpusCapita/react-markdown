import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import AutocompleteContainer from './AutocompleteContainer';
import PlainMarkdownInput from '../../PlainMarkdownInput.react';
import Plain from 'slate-plain-serializer';

const event = {
  preventDefault() {},
  stopPropagation() {}
};

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

const extensions = [
  {
    objectClassName: 'Product',
    specialCharacter: '#',
    color: '#9ed69e',
    termRegex: /^\#(\w*)$/,
    searchItems(term) {
      const items = [
        { _objectLabel: 'a1' },
        { _objectLabel: 'a2' },
        { _objectLabel: 'a23' },
        { _objectLabel: 'b1' },
        { _objectLabel: 'ba2' },
        { _objectLabel: 'ba21' },
        { _objectLabel: 'ba222' },
        { _objectLabel: 'ba23' },
        { _objectLabel: 'ba24' },
        { _objectLabel: 'ba25' },
        { _objectLabel: 'ba255' },
        { _objectLabel: 'ba256' },
        { _objectLabel: 'ba257' }
      ];
      return Promise.resolve(
        items.filter(
          ({ _objectLabel }) => _objectLabel.startsWith(term.substring(1))
        )
      );
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
        { _objectLabel: 'a1' },
        { _objectLabel: 'a2' },
        { _objectLabel: 'a23' },
        { _objectLabel: 'b1' },
        { _objectLabel: 'ba2' },
        { _objectLabel: 'ba21' },
        { _objectLabel: 'ba222' },
        { _objectLabel: 'ba23' },
        { _objectLabel: 'ba24' },
        { _objectLabel: 'ba25' },
        { _objectLabel: 'ba255' },
        { _objectLabel: 'ba256' },
        { _objectLabel: 'ba257' }
      ];
      return Promise.resolve(
        items.filter(
          ({ _objectLabel }) => _objectLabel.startsWith(term.substring(1))
        )
      );
    },
    markdownText(item) {
      return '$' + item._objectLabel;
    }
  }
];

describe('<AutocompleteContainer />', () => {
  it.skip('+ creation by default', () => {
    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    expect(component.props.options.extensions).to.deep.equal(extensions);
    let wrapper = shallow(component);
    let currState = wrapper.state();
    expect(currState.show).to.equal(false);
    expect(currState.selectedIndex).to.equal(0);
    expect(currState.isMouseIndexSelected).to.equal(false);
    expect(currState.items).to.deep.equal([]);
    expect(currState.ref).to.equal(null);
  });

  it.skip('componentWillReceiveProps(nextProps)', () => {
    const nodeText = '# Header1 ';
    let inputComponent = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = shallow(inputComponent);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length - 1, nodeText.length - 1);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleSelectItem = sinon.spy();
    wrapperInstance.searchItems = sinon.spy();
    wrapperInstance.componentWillReceiveProps({ state: editorState });
    expect(wrapperInstance.handleSelectItem.callCount).to.equal(1);
    expect(wrapperInstance.searchItems.callCount).to.equal(1);
  });

  it.skip('+ matchExtension(extensions, token)', () => {
    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    let token = '#ba';
    let extension = wrapperInstance.matchExtension(extensions, token);
    expect(extension).to.deep.equal(extensions[0]);

    token = 'ba';
    extension = wrapperInstance.matchExtension(extensions, token);
    expect(extension).to.deep.equal(undefined);
  });

  it.skip('+ getSearchToken(state)', () => {
    const nodeText = '# Header1 ';
    let inputComponent = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = shallow(inputComponent);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length - 1, nodeText.length - 1);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    let { term, text, offset } = wrapperInstance.getSearchToken(editorState);
    expect(term).to.equal('Header1');
    expect(text).to.equal(nodeText);
    expect(offset).to.equal(2);

    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;
    let res = wrapperInstance.getSearchToken(editorState);
    expect(res.term).to.equal('# Header1 ');
    expect(res.text).to.equal(nodeText);
    expect(res.offset).to.equal(-1);
  });

  it.skip('+ handleSelectedIndexChange(selectedIndex)', () => {
    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleSelectedIndexChange(3);
    expect(wrapper.state('isMouseIndexSelected')).to.equal(true);
    expect(wrapper.state('selectedIndex')).to.equal(3);
  });

  it.skip('+ handleKeyDown(e)', (done) => {
    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();

    // is not shown
    event.keyCode = arrowDownCode;
    wrapperInstance.handleKeyDown(event);
    expect(wrapper.state('show')).to.equal(false);
    expect(wrapper.state('selectedIndex')).to.equal(0);

    let extension = extensions[0];
    extension.searchItems('#ba').
    then((items) => {
      wrapper.setState({ items, selectedIndex: 2, show: true });

      expect(wrapper.state('show')).to.equal(true);
      expect(wrapper.state('selectedIndex')).to.equal(2);

      // escape
      event.keyCode = escapeCode;
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('show')).to.equal(false);

      // enter
      wrapper.setState({ show: true });
      let backupHandleSelectItem = wrapperInstance.handleSelectItem;
      wrapperInstance.handleSelectItem = sinon.spy();
      event.keyCode = enterCode;
      wrapperInstance.handleKeyDown(event);
      expect(wrapperInstance.handleSelectItem.getCall(0).args[0]).to.equal(2);
      expect(wrapperInstance.handleSelectItem.callCount).to.equal(1);
      wrapperInstance.handleSelectItem = backupHandleSelectItem;

      // arrowUpCode
      wrapper.setState({ show: true });
      event.keyCode = arrowUpCode;
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(1);
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(0);
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(0);

      // arrowDownCode
      wrapper.setState({ selectedIndex: 6 });
      event.keyCode = arrowDownCode;
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(7);
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(8);
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(8);

      // other
      wrapper.setState({ selectedIndex: 6 });
      event.keyCode = 200;
      wrapperInstance.handleKeyDown(event);
      expect(wrapper.state('selectedIndex')).to.equal(6);
      expect(wrapper.state('show')).to.equal(true);

      delete event.keyCode;
      done();
    }).
    catch(e => {
      console.log(e);
      throw e;
    });
  });

  it.skip('+ handleSelectItem(index)', (done) => {
    const nodeText = '# bi2 #ba';
    let inputComponent = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = shallow(inputComponent);
    inputWrapper.setState({ isFocused: true });
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo('# bi2'.length, '# bi2'.length);
    editorState = editorChange.state;

    let handlerChange = sinon.spy();
    let component = (<AutocompleteContainer
      options={{ extensions }}
      onChange={handlerChange}
      state={editorState}
      show={true}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();

    wrapperInstance.handleSelectItem(2);
    expect(handlerChange.callCount).to.equal(0);
    expect(wrapper.state('show')).to.equal(false);

    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;
    wrapper.setProps({ state: editorState });
    let extension = extensions[0];
    extension.searchItems('#ba').
    then((items) => {
      wrapper.setState({ items, selectedIndex: 2, show: true });
      expect(wrapper.state('show')).to.equal(true);
      wrapperInstance.handleSelectItem(2);
      expect(handlerChange.callCount).to.equal(1);
      let newState = handlerChange.getCall(0).args[0];
      expect(Plain.serialize(newState)).to.equal('# bi2 #ba222 ');
      expect(wrapper.state('show')).to.equal(false);
      done();
    });
  });

  it('searchItems({ state, options })', (done) => {
    const nodeText = '# open #ba';
    let inputComponent = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = shallow(inputComponent);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();

    wrapper.setState({ show: true });
    editorChange.moveOffsetsTo('# open'.length, '# open'.length);
    editorState = editorChange.state;
    wrapperInstance.searchItems({ state: editorState, options: { extensions } });
    expect(wrapper.state('show')).to.equal(false);
    expect(wrapper.state('items')).to.deep.equal([]);

    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;
    wrapperInstance.searchItems({ state: editorState, options: { extensions } });

    setTimeout(() => {
      expect(wrapper.state('show')).to.equal(true);
      const pattern = [
        { _objectLabel: "ba2" },
        { _objectLabel: "ba21" },
        { _objectLabel: "ba222" },
        { _objectLabel: "ba23" },
        { _objectLabel: "ba24" },
        { _objectLabel: "ba25" },
        { _objectLabel: "ba255" },
        { _objectLabel: "ba256" },
        { _objectLabel: "ba257" }
      ];
      expect(wrapper.state('items')).to.deep.equal(pattern);
      done();
    }, 100);
  });

  it.skip('+ handleRef(ref)', () => {
    let component = (<AutocompleteContainer
      options={{ extensions }}
    />);
    let wrapper = shallow(component);
    let wrapperInstance = wrapper.instance();
    let ref = { name: 'ref' };
    wrapperInstance.handleRef(ref);
    expect(wrapper.state('ref')).to.equal(ref);
  });
});
