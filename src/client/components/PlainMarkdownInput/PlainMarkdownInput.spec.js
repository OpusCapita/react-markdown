import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import PlainMarkdownInput from '.';
import { parse } from './slate/tokenizer';
import { List } from 'immutable';


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

  describe.skip('_getCopyText(state)', () => {
    it('singleline text', () => {
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
      const resText = wrapperInstance._getCopyText(state);
      const pattern = `# header *italic*`;
      expect(resText).to.equal(pattern);
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
      const resText = wrapperInstance._getCopyText(state);
      const pattern = `header *`;
      expect(resText).to.equal(pattern);
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
      const resText = wrapperInstance._getCopyText(state);
      const pattern = `header *italic*
## header *italic*
### header *italic*
#### header *italic*
##### header *italic*
######`;
      expect(resText).to.equal(pattern);
    });
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
  });
});
