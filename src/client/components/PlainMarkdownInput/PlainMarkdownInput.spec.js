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

  it('should have default props', () => {
    const component = <PlainMarkdownInput />;
    expect(component.props.extensions).to.deep.equal([]);
    expect(component.props.value).to.equal('');
    expect(component.props.onFullScreen).to.be.a('function');
    expect(component.props.onChange).to.be.a('function');
  });

  it('should have right props', () => {
    const nodeText = '# Header1';
    const component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);
    expect(component.props.value).to.equal(nodeText);
    expect(component.props.fullScreen).to.equal(true);
    expect(component.props.readOnly).to.equal(true);

    const wrapper = mount(component);
    const editorState = wrapper.state('editorState');

    const nodes = editorState.document.nodes.asMutable();
    const nodesSize = nodes.size;
    expect(nodesSize).to.equal(1);

    const currNode = nodes.get(0).asMutable();
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should have right props after receive props', () => {
    const nodeText = '# Header1';
    const newNodeText = '## Header2';
    const component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={true}
      readOnly={true}
    />);
    const wrapper = mount(component);
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
    const component = (<PlainMarkdownInput
      value={nodeText}
    />);
    const wrapper = mount(component);
    const editorStateOld = wrapper.state('editorState');

    wrapper.setProps({ value: newNodeText });

    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleChange({ state: editorStateOld });

    const editorState = wrapper.state('editorState');
    const currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should have right text after changed for readOnly = false #2', () => {
    const nodeText = '# Header1';
    const newNodeText = '## Header2';
    const component = (<PlainMarkdownInput
      value={nodeText}
    />);
    const wrapper = mount(component);
    const editorStateOld = wrapper.state('editorState');

    wrapper.setProps({ value: newNodeText });

    const wrapperInstance = wrapper.instance();
    wrapperInstance.handleChange(editorStateOld);

    const editorState = wrapper.state('editorState');
    const currNode = editorState.document.nodes.get(0);
    expect(currNode.data.text).to.equal(nodeText);
    expect(currNode.data.tokens).to.deep.equal(parse(nodeText));
  });

  it('should change state.fullScreen after call handleFullScreen()', () => {
    const component = <PlainMarkdownInput />;
    const wrapper = mount(component);
    let fullScreen = wrapper.state('fullScreen');
    expect(fullScreen).to.equal(false);

    const wrapperInstance = wrapper.instance();
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
      const component = (<PlainMarkdownInput
        value={nodeText}
      />);
      const wrapper = mount(component);
      const wrapperInstance = wrapper.instance();
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
      const component = (<PlainMarkdownInput
        value={nodeText}
      />);
      const wrapper = mount(component);
      const wrapperInstance = wrapper.instance();
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
      const component = (<PlainMarkdownInput
        value={nodeText}
      />);
      const wrapper = mount(component);
      const wrapperInstance = wrapper.instance();
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
      const component = (<PlainMarkdownInput
        value={nodeText}
      />);
      const wrapper = mount(component);
      const wrapperInstance = wrapper.instance();
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
      const nodeText = '# header *italic*';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const wrapperInstance = wrapper.instance();
      const editorState = wrapper.state('editorState');
      let change = editorState.change();
      change.moveOffsetsTo(2, 10);
      change = wrapperInstance.handleCut(event, {}, change);
      expect(Plain.serialize(change.state)).to.equal('# italic*');
    });
  });

  describe('toggleAccent(state, accent)', () => {
    it('strikethrough', () => {
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
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'strikethrough');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      let newState = wrapperInstance.handleChange.getCall(0).args[0];
      const isSetFocus = wrapperInstance.handleChange.getCall(0).args[1];
      expect(Plain.serialize(newState)).to.equal('strikethrough text');
      expect(isSetFocus).to.equal(true);

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
      editorState = change.state;
      wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'strikethrough');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      newState = wrapperInstance.handleChange.getCall(0).args[0];
      expect(Plain.serialize(newState)).to.equal('~~strikethrough text~~');
    });

    it('bold', () => {
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
      editorState = change.state;
      let wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'bold');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      let newState = wrapperInstance.handleChange.getCall(0).args[0];
      const isSetFocus = wrapperInstance.handleChange.getCall(0).args[1];
      expect(Plain.serialize(newState)).to.equal('bold text');
      expect(isSetFocus).to.equal(true);

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
      editorState = change.state;
      wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'bold');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      newState = wrapperInstance.handleChange.getCall(0).args[0];
      expect(Plain.serialize(newState)).to.equal('**bold text**');
    });

    it('italic', () => {
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
      editorState = change.state;
      let wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'italic');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      let newState = wrapperInstance.handleChange.getCall(0).args[0];
      const isSetFocus = wrapperInstance.handleChange.getCall(0).args[1];
      expect(Plain.serialize(newState)).to.equal('italic text');
      expect(isSetFocus).to.equal(true);

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
      editorState = change.state;
      wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.toggleAccent(editorState, 'italic');
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      newState = wrapperInstance.handleChange.getCall(0).args[0];
      expect(Plain.serialize(newState)).to.equal('_italic text_');
    });
  });

  describe('handleEnterFromListDown(change, accent)', () => {
    it("handleEnterFromListDown(change, 'ul')", (done) => {
      const nodeText = '* Item 1';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      change.moveOffsetsTo(nodeText.length, nodeText.length);
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.handleEnterFromListDown(change, 'ul');

      setTimeout(() => {
        expect(wrapperInstance.handleChange.callCount).to.equal(1);
        done();
      }, 150);
    });

    it("handleEnterFromListDown(change, 'ol')", (done) => {
      const nodeText = '1. Item 1';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      change.moveOffsetsTo(nodeText.length, nodeText.length);
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.handleEnterFromListDown(change, 'ol');

      setTimeout(() => {
        expect(wrapperInstance.handleChange.callCount).to.equal(1);
        done();
      }, 150);
    });
  });

  describe('handlePaste(event, change)', () => {
    it('window.clipboardData is not defined', () => {
      const backupClipboardData = window.clipboardData;
      window.clipboardData = undefined;

      const nodeText = '**bold text**';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.handlePaste({}, {});
      expect(wrapperInstance.handleChange.callCount).to.equal(0);
      window.clipboardData = backupClipboardData;
    });

    it('window.clipboardData is defined, paste single line', () => {
      const backupClipboardData = window.clipboardData;
      window.clipboardData = {
        getData() {
          return "Plain text";
        }
      };

      const nodeText = '**bold text**';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      const change = editorState.change();
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.handlePaste(event, change);
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      editorState = wrapperInstance.handleChange.getCall(0).args[0];
      expect(Plain.serialize(editorState)).to.equal('Plain text**bold text**');

      window.clipboardData = backupClipboardData;
    });

    it('window.clipboardData is defined, paste multiline text', () => {
      const backupClipboardData = window.clipboardData;
      window.clipboardData = {
        getData() {
          return "Plain text\nPlain text";
        }
      };

      const nodeText = '**bold text**';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      let editorState = wrapper.state('editorState');
      const change = editorState.change();
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleChange = sinon.spy();
      wrapperInstance.handlePaste(event, change);
      expect(wrapperInstance.handleChange.callCount).to.equal(1);
      editorState = wrapperInstance.handleChange.getCall(0).args[0];
      expect(Plain.serialize(editorState)).to.equal('Plain text\nPlain text**bold text**');

      window.clipboardData = backupClipboardData;
    });
  });

  describe('handleKeyDown(event, data, change)', () => {
    it('ctrl-v', () => {
      const nodeText = '**bold text**';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handlePaste = sinon.spy();
      wrapperInstance.handleKeyDown(event, {
        key: 'v',
        isMod: true
      }, change);
      expect(wrapperInstance.handlePaste.callCount).to.equal(1);
      const newEvent = wrapperInstance.handlePaste.getCall(0).args[0];
      const newChange = wrapperInstance.handlePaste.getCall(0).args[1];
      expect(newEvent).to.equal(event);
      expect(newChange).to.equal(change);
    });

    it('ctrl-s', () => {
      const nodeText = 'plain text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();
      wrapperInstance.handleKeyDown(event, {
        key: 's',
        isMod: true
      }, change);
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      const newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      const accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.equal(change.state);
      expect(accent).to.equal('strikethrough');
    });

    it('ctrl-b', () => {
      const nodeText = 'plain text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = mount(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();
      wrapperInstance.handleKeyDown(event, {
        key: 'b',
        isMod: true
      }, change);
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      const newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      const accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.equal(change.state);
      expect(accent).to.equal('bold');
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
    const component = (<PlainMarkdownInput
      value={nodeText}
      fullScreen={fullScreen}
      readOnly={readOnly}
    />);

    const wrapper = mount(component);
    const editorState = wrapper.state('editorState');
    const change = editorState.change();
    change.moveOffsetsTo(start, end);
    wrapper.setState({ editorState: change.state });
    const wrapperInstance = wrapper.instance();
    wrapperInstance.setState = sinon.spy();
    return wrapperInstance;
  }

  function checkIt(wrapperInstance, pattern) {
    expect(wrapperInstance.setState.callCount).to.equal(1);
    const newState = wrapperInstance.setState.getCall(0).args[0];
    expect(Plain.serialize(newState.editorState)).to.equal(pattern);
  }

  describe('handleActionButtonClick(accent)', () => {
    it('bold', () => {
      const nodeText = '**bold text**';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const editorState = wrapper.state('editorState');
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();
      wrapperInstance.handleActionButtonClick('bold');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      const newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      const accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('bold');
    });

    it('italic', () => {
      const nodeText = '_italic text_';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const editorState = wrapper.state('editorState');
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();
      wrapperInstance.handleActionButtonClick('italic');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      const newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      const accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('italic');
    });

    it('strikethrough', () => {
      const nodeText = '~~strikethrough text~~';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const editorState = wrapper.state('editorState');
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();
      wrapperInstance.handleActionButtonClick('strikethrough');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      const newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      const accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('strikethrough');
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
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const editorState = wrapper.state('editorState');
      const change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleLinkButtonClick();
      const newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('[text](http://example.com)');
    });
  });

  describe('handleAdditionalButtonsClick()', () => {
    const additionalButtons = [
      {
        iconComponent: (<i className="fa fa-search"></i>),
        handleButtonPress({ value, insertAtCursorPosition }) {
          insertAtCursorPosition('#Product.new');
        },
        label: 'Product'
      },
    ];

    it('handleAdditionalButtonsClick', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
        additionalButtons={[
          {
            iconComponent: (<i className="fa fa-search"></i>),
            handleButtonPress({ value, insertAtCursorPosition }) {
              insertAtCursorPosition('#Product.new');
            },
            label: 'Product'
          },
        ]}
      />);

      const wrapper = shallow(component);
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleAdditionalButtonsClick(additionalButtons[0].handleButtonPress);
      const newState = wrapper.state('editorState');
      expect(Plain.serialize(newState)).to.equal('#Product.newtext');
    });
  });

  describe('handleMouseUp ()', () => {
    it('handleMouseUp ', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      let editorState = wrapper.state('editorState');
      const change = editorState.change();
      change.blur();
      expect(change.state.isFocused).to.equal(false);
      wrapper.setState({ editorState: change.state });
      const wrapperInstance = wrapper.instance();
      wrapperInstance.handleMouseUp();
      editorState = wrapper.state('editorState');
      expect(editorState.isFocused).to.equal(true);
    });
  });

  describe('Button click', () => {
    it('ActionButton', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const editorState = wrapper.state('editorState');
      const wrapperInstance = wrapper.instance();
      wrapperInstance.toggleAccent = sinon.spy();

      const actionButtons = wrapper.find(`ActionButton`);
      expect(actionButtons).to.have.length(5);
      const boldButton = actionButtons.at(0).shallow();
      const italicButton = actionButtons.at(1).shallow();
      const strikethroughButton = actionButtons.at(2).shallow();
      const olButton = actionButtons.at(3).shallow();
      const ulButton = actionButtons.at(4).shallow();

      boldButton.simulate('click');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(1);
      let newState = wrapperInstance.toggleAccent.getCall(0).args[0];
      let accent = wrapperInstance.toggleAccent.getCall(0).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('bold');

      italicButton.simulate('click');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(2);
      newState = wrapperInstance.toggleAccent.getCall(1).args[0];
      accent = wrapperInstance.toggleAccent.getCall(1).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('italic');

      strikethroughButton.simulate('click');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(3);
      newState = wrapperInstance.toggleAccent.getCall(2).args[0];
      accent = wrapperInstance.toggleAccent.getCall(2).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('strikethrough');

      olButton.simulate('click');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(4);
      newState = wrapperInstance.toggleAccent.getCall(3).args[0];
      accent = wrapperInstance.toggleAccent.getCall(3).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('ol');

      ulButton.simulate('click');
      expect(wrapperInstance.toggleAccent.callCount).to.equal(5);
      newState = wrapperInstance.toggleAccent.getCall(4).args[0];
      accent = wrapperInstance.toggleAccent.getCall(4).args[1];
      expect(newState).to.deep.equal(editorState);
      expect(accent).to.equal('ul');
    });

    it('HeaderButton', () => {
      const nodeText = 'Header line';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const headerButtons = wrapper.find(`HeaderButton`);
      expect(headerButtons).to.have.length(6);
      const headerButton1 = headerButtons.at(0).shallow();
      const headerButton2 = headerButtons.at(1).shallow();
      const headerButton3 = headerButtons.at(2).shallow();
      const headerButton4 = headerButtons.at(3).shallow();
      const headerButton5 = headerButtons.at(4).shallow();
      const headerButton6 = headerButtons.at(5).shallow();

      let editorState = wrapper.state('editorState');
      const change = editorState.change();
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
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const linkButtons = wrapper.find(`LinkButton`);
      expect(linkButtons).to.have.length(1);
      const linkButton = linkButtons.at(0).shallow();

      let editorState = wrapper.state('editorState');
      const change = editorState.change();
      change.moveOffsetsTo(0, nodeText.length);
      wrapper.setState({ editorState: change.state });

      linkButton.simulate('click');
      editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('[text](http://example.com)');
    });

    it('AdditionalButton', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
        additionalButtons={[
          {
            iconComponent: (<i className="fa fa-search"></i>),
            handleButtonPress({ value, insertAtCursorPosition }) {
              insertAtCursorPosition('#Product.new');
            },
            label: 'Product'
          },
        ]}
      />);

      const wrapper = shallow(component);
      const additionalButtons = wrapper.find(`AdditionalButton`);
      expect(additionalButtons).to.have.length(1);
      const additionalButton = additionalButtons.at(0).shallow();
      additionalButton.simulate('click');
      const editorState = wrapper.state('editorState');
      expect(Plain.serialize(editorState)).to.equal('#Product.newtext');
    });

    it('FullScreenButton hide', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
      />);

      const wrapper = shallow(component);
      const fullScreenButtons = wrapper.find(`FullScreenButton`);
      expect(fullScreenButtons).to.have.length(0);
    });

    it('FullScreenButton show', () => {
      const nodeText = 'text';
      const component = (<PlainMarkdownInput
        value={nodeText}
        fullScreen={false}
        readOnly={false}
        showFullScreenButton={true}
      />);

      const wrapper = shallow(component);
      const fullScreenButtons = wrapper.find(`FullScreenButton`);
      expect(fullScreenButtons).to.have.length(1);
      const fullScreenButton = fullScreenButtons.at(0).shallow().find('button');

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
