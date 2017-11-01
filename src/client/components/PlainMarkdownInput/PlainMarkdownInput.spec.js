import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import PlainMarkdownInput from '.';
import { parse } from './slate/tokenizer';
import { List } from 'immutable';
import Plain from 'slate-plain-serializer';

const event = {
  preventDefault() {}
};

describe('<PlainMarkdownInput />', () => {
  const nodeText = `###### h6

 # h1
 ## h2
 ### h3
 #### h4
 ##### h5
 ###### h6

# header *italic*
## header *italic*
### header *italic*
#### header *italic*
##### header *italic*
###### header *italic*
`;

  before(() => {
    window.getSelection = function() {
      return { anchorNode: null };
    };
  });

  it('should have default props', () => {
    let component = <PlainMarkdownInput />;
    expect(component.props.extensions).to.deep.equal([]);
    expect(component.props.value).to.equal('');
    expect(component.props.onFullScreen).to.be.a('function');
    expect(component.props.onChange).to.be.a('function');
  });

  it('should have right props', () => {
    const nodeText = '# Header1';
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);
    expect(component.props.value).to.equal(nodeText);
    expect(component.props.fullScreen).to.equal(true);
    expect(component.props.readOnly).to.equal(true);

    let wrapper = mount(component);
    let editorState = wrapper.state('editorState');

    let nodes = editorState.document.nodes.asMutable();
    let nodesSize = nodes.size;
    expect(nodesSize).to.equal(1);

    const currNode = nodes.get(0).asMutable();
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should have right props after receive props', () => {
    const nodeText = '# Header1';
    const newNodeText = '## Header2';
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);
    let wrapper = mount(component);
    let editorState = wrapper.state('editorState');
    let currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));

    wrapper.setProps({ value: newNodeText });
    editorState = wrapper.state('editorState');
    currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(newNodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(newNodeText));

    wrapper.setProps({ value: newNodeText });
    editorState = wrapper.state('editorState');
    currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(newNodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(newNodeText));
  });

  it('should have right text after changed for readOnly = false', () => {
    const nodeText = '# Header1';
    const newNodeText = '## Header2';
    let component = (<PlainMarkdownInput
      value={nodeText}
    />);
    let wrapper = mount(component);
    let editorStateOld = wrapper.state('editorState');

    wrapper.setProps({ value: newNodeText });

    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleChange({ state: editorStateOld });

    let editorState = wrapper.state('editorState');
    let currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should have right text after changed for readOnly = false #2', () => {
    const nodeText = '# Header1';
    const newNodeText = '## Header2';
    let component = (<PlainMarkdownInput
      value={nodeText}
    />);
    let wrapper = mount(component);
    let editorStateOld = wrapper.state('editorState');

    wrapper.setProps({ value: newNodeText });

    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleChange(editorStateOld);

    let editorState = wrapper.state('editorState');
    let currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should change state.fullScreen after call handleFullScreen()', () => {
    let component = <PlainMarkdownInput />;
    let wrapper = mount(component);
    let fullScreen = wrapper.state('fullScreen');
    expect(fullScreen).to.equal(false);

    let wrapperInstance = wrapper.instance();
    wrapperInstance.handleFullScreen();
    fullScreen = wrapper.state('fullScreen');
    expect(fullScreen).to.equal(true);

    wrapperInstance.handleFullScreen();
    fullScreen = wrapper.state('fullScreen');
    expect(fullScreen).to.equal(false);
  });

  describe('handleCopy(event, data, change)', () => {
    let event;
    beforeEach(() => {
      event = {
        preventDefault() {},
        clipboardData: {
          setData: sinon.spy()
        }
      }
    });

    it('line`s part', () => {
      let component = (<PlainMarkdownInput
        value={nodeText}
      />);
      let wrapper = mount(component);
      let wrapperInstance = wrapper.instance();
      const state = {
        startKey: '018',
        endKey: '018',
        startOffset: 2,
        endOffset: 10,
        texts: List([{ text: '# header *italic*' }])
      };
      const change = wrapperInstance.handleCopy(event, {}, { state });
      const changePattern = { state };
      const pattern = `header *`;
      expect(change).to.deep.equal(changePattern);
      expect(event.clipboardData.setData.callCount).to.equal(1);
      expect(event.clipboardData.setData.calledWith('text/plain', pattern)).to.equal(true);
    });

    it('single line', () => {
      let component = (<PlainMarkdownInput
        value={nodeText}
      />);
      let wrapper = mount(component);
      let wrapperInstance = wrapper.instance();
      const state = {
        startKey: '018',
        endKey: '018',
        startOffset: 0,
        endOffset: 17,
        texts: List([{ text: '# header *italic*' }])
      };
      const change = wrapperInstance.handleCopy(event, {}, { state });
      const changePattern = { state };
      const pattern = `# header *italic*`;
      expect(change).to.deep.equal(changePattern);
      expect(event.clipboardData.setData.callCount).to.equal(1);
      expect(event.clipboardData.setData.calledWith('text/plain', pattern)).to.equal(true);
    });

    it('multiline text', () => {
      let component = (<PlainMarkdownInput
        value={nodeText}
      />);
      let wrapper = mount(component);
      let wrapperInstance = wrapper.instance();
      const state = {
        startKey: '018',
        endKey: '028',
        startOffset: 2,
        endOffset: 6,
        texts: List([
          { text: '# header *italic*' },
          { text: '## header *italic*' },
          { text: '### header *italic*' },
          { text: '#### header *italic*' },
          { text: '##### header *italic*' },
          { text: '###### header *italic*' }
        ])
      };
      const change = wrapperInstance.handleCopy(event, {}, { state });
      const changePattern = { state };
      const pattern = `header *italic*
## header *italic*
### header *italic*
#### header *italic*
##### header *italic*
######`;
      expect(change).to.deep.equal(changePattern);
      expect(event.clipboardData.setData.callCount).to.equal(1);
      expect(event.clipboardData.setData.calledWith('text/plain', pattern)).to.equal(true);
    });

    it('single line for window.clipboardData', () => {
      let component = (<PlainMarkdownInput
        value={nodeText}
      />);
      let wrapper = mount(component);
      let wrapperInstance = wrapper.instance();
      const state = {
        startKey: '018',
        endKey: '018',
        startOffset: 0,
        endOffset: 17,
        texts: List([{ text: '# header *italic*' }])
      };

      window.clipboardData = { // eslint-disable-line
        setData: sinon.spy()
      };

      const change = wrapperInstance.handleCopy(event, {}, { state });
      const changePattern = { state };
      const pattern = `# header *italic*`;
      expect(change).to.deep.equal(changePattern);
      expect(window.clipboardData.setData.callCount).to.equal(1);
      expect(window.clipboardData.setData.calledWith('Text', pattern)).to.equal(true);
      delete window.clipboardData;
    });
  });

  describe('handleCut(event, data, change)', () => {
    let event;
    beforeEach(() => {
      event = {
        preventDefault() {},
        clipboardData: {
          setData: sinon.spy()
        }
      }
    });

    it('line`s part', () => {
      let nodeText = '# header *italic*';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      let wrapperInstance = wrapper.instance();
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, 10);
      change = wrapperInstance.handleCut(event, {}, change);
      expect(Plain.serialize(change.state)).to.equal('# italic*');
    });
  });

  describe('toggleAccent(state, accent)', () => {
    it.skip('strikethrough', () => {
      let nodeText = '~~strikethrough text~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      editorState = change.state;
      let wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'strikethrough');
      expect(wrapperInstance.setState.callCount).to.equal(1);
      let newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('strikethrough text');

      nodeText = 'strikethrough text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      editorState = change.state;
      wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'strikethrough');
      expect(wrapperInstance.setState.callCount).to.equal(1);
      newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('~~strikethrough text~~');
    });
  });

  describe('handleKeyDown(event, data, change)', () => {
    it.skip('bold', () => {
      let nodeText = '**bold text**';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, {
        key: 'b',
        isMod: true
      }, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      let newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('bold text');

      nodeText = 'bold text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = mount(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, {
        key: 'b',
        isMod: true
      }, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('**bold text**');
    });

    it.skip('strikethrough', () => {
      let eventData = {
        key: 's',
        isMod: true
      };
      let nodeText = '~~strikethrough text~~';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, nodeText.length - 2);
      let wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, eventData, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      let newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('strikethrough text');

      nodeText = 'strikethrough text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = mount(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, eventData, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('~~strikethrough text~~');
    });

    it.skip('italic', () => {
      let eventData = {
        key: 'i',
        isMod: true
      };
      let nodeText = '_italic text_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, eventData, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      let newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('italic text');

      nodeText = 'italic text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = mount(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapperInstance = wrapper.instance();
      wrapperInstance.setState = sinon.spy();
      wrapperInstance.handleKeyDown(event, eventData, change);
      expect(wrapperInstance.setState.callCount).to.equal(1);
      newState = wrapperInstance.setState.getCall(0).args[0];
      expect(Plain.serialize(newState.editorState)).to.equal('_italic text_');
    });

    it('without mod', () => {
      let eventData = {
        key: 'i',
        isMod: false
      };
      let nodeText = '_italic text_';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(1, nodeText.length - 1);
      let wrapperInstance = wrapper.instance();
      wrapperInstance.handleKeyDown(event, eventData, change);
      let newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('_italic text_');

      eventData = {
        key: 'i',
        isMod: false
      };
      nodeText = 'italic text';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapperInstance = wrapper.instance();
      wrapperInstance.handleKeyDown(event, eventData, change);
      newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('italic text');
    });
  });

  function initIt(nodeText, { start, end }, fullScreen = false, readOnly = false) {
    let component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={fullScreen}
      readOnly={readOnly}
    />);

    let wrapper = mount(component);
    let editorState = wrapper.state('editorState');
    let change = editorState.change();
    change.moveOffsetsTo(start, end);
    wrapper.setState({ editorState: change.state });
    let wrapperInstance = wrapper.instance();
    wrapperInstance.setState = sinon.spy();
    return wrapperInstance;
  }

  function checkIt(wrapperInstance, pattern) {
    expect(wrapperInstance.setState.callCount).to.equal(1);
    let newState = wrapperInstance.setState.getCall(0).args[0];
    expect(Plain.serialize(newState.editorState)).to.equal(pattern);
  }

  describe('handleActionButtonClick(accent)', () => {
    it.skip('bold', () => {
      let nodeText = '**bold text**';
      let wrapperInstance = initIt(nodeText, { start: 2, end: nodeText.length - 2 });
      wrapperInstance.handleActionButtonClick('bold');
      checkIt(wrapperInstance, 'bold text');

      nodeText = 'bold text';
      wrapperInstance = initIt(nodeText, { start: 0, end: nodeText.length });
      wrapperInstance.handleActionButtonClick('bold');
      checkIt(wrapperInstance, '**bold text**');
    });

    it.skip('italic', () => {
      let nodeText = '_italic text_';
      let wrapperInstance = initIt(nodeText, { start: 1, end: nodeText.length - 1 });
      wrapperInstance.handleActionButtonClick('italic');
      checkIt(wrapperInstance, 'italic text');

      nodeText = 'italic text';
      wrapperInstance = initIt(nodeText, { start: 0, end: nodeText.length });
      wrapperInstance.handleActionButtonClick('italic');
      checkIt(wrapperInstance, '_italic text_');
    });

    it.skip('strikethrough', () => {
      let nodeText = '~~strikethrough text~~';
      let wrapperInstance = initIt(nodeText, { start: 2, end: nodeText.length - 2 });
      wrapperInstance.handleActionButtonClick('strikethrough');
      checkIt(wrapperInstance, 'strikethrough text');

      nodeText = 'strikethrough text';
      wrapperInstance = initIt(nodeText, { start: 0, end: nodeText.length });
      wrapperInstance.handleActionButtonClick('strikethrough');
      checkIt(wrapperInstance, '~~strikethrough text~~');
    });

    it('unordered list', () => {
      let nodeText = 'item';
      let wrapperInstance = initIt(nodeText, { start: 2, end: nodeText.length - 2 });
      wrapperInstance.handleActionButtonClick('ul');
      checkIt(wrapperInstance, '* item');

      nodeText = '* item';
      wrapperInstance = initIt(nodeText, { start: 0, end: nodeText.length });
      wrapperInstance.handleActionButtonClick('ul');
      checkIt(wrapperInstance, 'item');
    });

    it('ordered list', () => {
      let nodeText = 'item';
      let wrapperInstance = initIt(nodeText, { start: 2, end: nodeText.length - 2 });
      wrapperInstance.handleActionButtonClick('ol');
      checkIt(wrapperInstance, '1. item');

      nodeText = '1. item';
      wrapperInstance = initIt(nodeText, { start: 0, end: nodeText.length });
      wrapperInstance.handleActionButtonClick('ol');
      checkIt(wrapperInstance, 'item');
    });
  });

  describe('handleHeaderButtonClick(level)', () => {
    it('# Header 1', () => {
      let nodeText = '# Header 1';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(5, 5);
      wrapper.setState({ editorState: change.state });
      let wrapperInstance = wrapper.instance();
      wrapperInstance.handleHeaderButtonClick(1);
      let newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('Header 1');

      nodeText = 'Header 1';
      component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      wrapper = shallow(component);
      editorState = wrapper.state('editorState');
      change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });
      wrapperInstance = wrapper.instance();
      wrapperInstance.handleHeaderButtonClick(1);
      newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('# Header 1');
    });
  });

  describe('handleLinkButtonClick()', () => {
    it('link', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });
      let wrapperInstance = wrapper.instance();
      wrapperInstance.handleLinkButtonClick();
      let newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('[text](http://example.com)');
    });
  });

  describe('handleMouseDown()', () => {
    it('handleMouseDown', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });
      let wrapperInstance = wrapper.instance();
      wrapperInstance.forceUpdate = sinon.spy();
      wrapperInstance.handleMouseDown();
      expect(wrapperInstance.forceUpdate.callCount).to.equal(1);
    });
  });

  describe('Button click', () => {
    it.skip('ActionButton', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      const actionButtons = wrapper.find(`ActionButton`);
      expect(actionButtons).to.have.length(5);
      let boldButton = actionButtons.at(0).shallow();
      let italicButton = actionButtons.at(1).shallow();
      let strikethroughButton = actionButtons.at(2).shallow();
      let olButton = actionButtons.at(3).shallow();
      let ulButton = actionButtons.at(4).shallow();

      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });

      boldButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('**text**');
      boldButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('text');

      italicButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('_text_');
      italicButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('text');

      strikethroughButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('~~text~~');
      strikethroughButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('text');

      olButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('1. text');
      olButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('text');

      ulButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('* text');
      ulButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('text');
    });

    it('HeaderButton', () => {
      let nodeText = 'Header line';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      const headerButtons = wrapper.find(`HeaderButton`);
      expect(headerButtons).to.have.length(6);
      let headerButton1 = headerButtons.at(0).shallow();
      let headerButton2 = headerButtons.at(1).shallow();
      let headerButton3 = headerButtons.at(2).shallow();
      let headerButton4 = headerButtons.at(3).shallow();
      let headerButton5 = headerButtons.at(4).shallow();
      let headerButton6 = headerButtons.at(5).shallow();

      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(7, nodeText.length);
      wrapper.setState({ editorState: change.state });

      headerButton1.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('# Header line');
      headerButton1.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');

      headerButton2.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('## Header line');
      headerButton2.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');

      headerButton3.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('### Header line');
      headerButton3.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');

      headerButton4.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('#### Header line');
      headerButton4.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');

      headerButton5.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('##### Header line');
      headerButton5.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');

      headerButton6.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('###### Header line');
      headerButton6.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('Header line');
    });

    it('LinkButton', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      const linkButtons = wrapper.find(`LinkButton`);
      expect(linkButtons).to.have.length(1);
      let linkButton = linkButtons.at(0).shallow();

      let editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });

      linkButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('[text](http://example.com)');
    });

    it('FullScreenButton', () => {
      let nodeText = 'text';
      let component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      let wrapper = shallow(component);
      const fullScreenButtons = wrapper.find(`FullScreenButton`);
      expect(fullScreenButtons).to.have.length(1);
      let fullScreenButton = fullScreenButtons.at(0).shallow().find('button');

      let fullScreen = wrapper.state('fullScreen');
      expect(fullScreen).to.equal(false);

      fullScreenButton.simulate('click');
      fullScreen = wrapper.state('fullScreen');
      expect(fullScreen).to.equal(true);

      fullScreenButton.simulate('click');
      fullScreen = wrapper.state('fullScreen');
      expect(fullScreen).to.equal(false);
    });
  });
});
