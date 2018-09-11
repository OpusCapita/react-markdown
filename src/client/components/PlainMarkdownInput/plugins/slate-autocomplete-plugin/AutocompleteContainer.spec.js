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
    specialCharacter: '#',
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
    specialCharacter: '$',
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
  it('creation by default', () => {
    const nodeText = '';
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    expect(component.props.options.extensions).to.deep.equal(extensions);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();

    let state = autocompleteContainerElement.state;
    expect(state.show).to.equal(false);
    expect(state.selectedItem).to.equal(0);
    expect(state.items).to.deep.equal([]);
  });

  it('componentWillReceiveProps(nextProps)', () => {
    const nodeText = '# Header1 ';
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length - 1, nodeText.length - 1);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();

    autocompleteContainerElement.searchItems = sinon.spy();
    autocompleteContainerElement.componentWillReceiveProps({ state: editorState });
    expect(autocompleteContainerElement.searchItems.callCount).to.equal(1);
  });

  it('matchExtension(extensions, token)', () => {
    const nodeText = '';
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();

    let token = '#ba';
    let extension = autocompleteContainerElement.matchExtension(extensions, token);
    expect(extension).to.deep.equal(extensions[0]);

    token = 'ba';
    extension = autocompleteContainerElement.matchExtension(extensions, token);
    expect(extension).to.deep.equal(undefined);
  });

  it('getSearchToken(state)', () => {
    const nodeText = '# Header1 ';
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length - 1, nodeText.length - 1);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();
    let { term, text, offset } = autocompleteContainerElement.getSearchToken(editorState);
    expect(term).to.equal('Header1');
    expect(text).to.equal(nodeText);
    expect(offset).to.equal(2);

    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;
    let res = autocompleteContainerElement.getSearchToken(editorState);
    expect(res.term).to.equal('# Header1 ');
    expect(res.text).to.equal(nodeText);
    expect(res.offset).to.equal(-1);
  });

  it('handleKeyDown(e)', (done) => {
    let markdownInputElement = (<PlainMarkdownInput
      value=""
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();

    // is not shown
    event.keyCode = arrowDownCode;
    autocompleteContainerElement.handleKeyDown(event);
    expect(autocompleteContainerElement.state.show).to.equal(false);
    expect(autocompleteContainerElement.state.selectedItem).to.equal(0);

    let extension = extensions[0];
    extension.searchItems('#ba').
    then((items) => {
      autocompleteContainerElement.setState({ items, selectedItem: 2, show: true });

      expect(autocompleteContainerElement.state.show).to.equal(true);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(2);

      // escape
      event.keyCode = escapeCode;
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.show).to.equal(false);

      // enter
      autocompleteContainerElement.setState({ show: true });
      let backupHandleSelectItem = autocompleteContainerElement.handleSelectItem;
      autocompleteContainerElement.handleSelectItem = sinon.spy();
      event.keyCode = enterCode;
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.handleSelectItem.getCall(0).args[0]).to.equal(2);
      expect(autocompleteContainerElement.handleSelectItem.callCount).to.equal(1);
      autocompleteContainerElement.handleSelectItem = backupHandleSelectItem;

      // arrowUpCode
      autocompleteContainerElement.setState({ show: true });
      event.keyCode = arrowUpCode;
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(1);
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(0);
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(0);

      // arrowDownCode
      autocompleteContainerElement.setState({ selectedItem: 6 });
      event.keyCode = arrowDownCode;
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(7);
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(8);
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(8);

      // other
      autocompleteContainerElement.setState({ selectedItem: 6 });
      event.keyCode = 200;
      autocompleteContainerElement.handleKeyDown(event);
      expect(autocompleteContainerElement.state.selectedItem).to.equal(6);
      expect(autocompleteContainerElement.state.show).to.equal(true);

      delete event.keyCode;
      done();
    }).
    catch(e => {
      console.log(e);
      throw e;
    });
  });

  it.skip('handleSelectItem(index)', (done) => {
    const nodeText = '# bi2 #ba';
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = shallow(markdownInputElement);
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
      wrapper.setState({ items, selectedItem: 2, show: true });
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
    let markdownInputElement = (<PlainMarkdownInput
      value={nodeText}
      extensions={extensions}
    />);
    let inputWrapper = mount(markdownInputElement);
    let editorState = inputWrapper.state('editorState');
    let editorChange = editorState.change();
    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;

    let component = (<AutocompleteContainer
      options={{ extensions }}
      state={editorState}
    />);
    let wrapper = mount(component);
    let autocompleteContainerElement = wrapper.find(AutocompleteContainer).at(0).childAt(0).instance();

    autocompleteContainerElement.setState({ show: true });
    editorChange.moveOffsetsTo('# open'.length, '# open'.length);
    editorState = editorChange.state;
    autocompleteContainerElement.searchItems({ state: editorState, options: { extensions } });
    expect(autocompleteContainerElement.state.show).to.equal(false);
    expect(autocompleteContainerElement.state.items).to.deep.equal([]);

    editorChange.moveOffsetsTo(nodeText.length, nodeText.length);
    editorState = editorChange.state;
    autocompleteContainerElement.searchItems({ state: editorState, options: { extensions } });

    setTimeout(() => {
      expect(autocompleteContainerElement.state.show).to.equal(true);
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
      expect(autocompleteContainerElement.state.items).to.deep.equal(pattern);
      done();
    }, 100);
  });
});
