import React from 'react';
import { findDOMNode } from 'react-dom';
import Types from 'prop-types';
import FullScreenButton from '../SlateEditor/plugins/slate-fullscreen-plugin/FullScreenButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import schema from './slate/schema';
import shortcuts from './slate/shortcuts';
import { hasMultiLineSelection } from './slate/transforms';
import './PlainMarkdownInput.less';
import { parse } from './slate/tokenizer';
import { autoScrollToTop } from './Utils';

import {
  AutocompletePlugin,
  ObjectReferenceButton
} from '../SlateEditor/plugins';

import {
  BoldButton,
  HeaderFiveButton,
  HeaderFourButton,
  HeaderOneButton,
  HeaderSixButton,
  HeaderThreeButton,
  HeaderTwoButton,
  ItalicButton,
  LinkButton,
  OrderedListButton,
  StrikethroughButton,
  UnorderedListButton
} from './buttons';

import { SlateContent, SlateEditor, SlateToolbar, SlateToolbarGroup } from '../SlateEditor';
import Plain from 'slate-plain-serializer';

function getCopyText(state) {
  const { startKey, startOffset, endKey, endOffset, texts } = state;
  let resText;

  if (startKey === endKey) {
    resText = texts.get(0).text.slice(startOffset, endOffset);
  } else {
    let resTextArr = texts.map((el, ind) => {
      if (ind === 0) {
        return el.text.slice(startOffset);
      } else if (ind === texts.size - 1) {
        return el.text.slice(0, endOffset);
      } else {
        return el.text;
      }
    });
    resText = resTextArr.join('\n');
  }
  return resText;
}

function copySelectionToClipboard(event, change) {
  event.preventDefault();
  const { state } = change;
  const resText = getCopyText(state);
  if (window.clipboardData) {
    window.clipboardData.setData("Text", resText);
  } else {
    event.clipboardData.setData('text/plain', resText);
  }
}

class PlainMarkdownInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: '',
      fullScreen: false
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleRef = this.handleRef.bind(this)
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    this.initialBodyOverflowStyle = document.body.style.overflow;
    this.handleNewValue(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.handleNewValue(nextProps.value);
    }
  }

  shouldComponentUpdate =(nextProps, nextState) => {
    return this.state.editorState.endKey !== nextState.editorState.endKey ||
      this.state.editorState.endOffset !== nextState.editorState.endOffset ||
      this.state.editorState.startKey !== nextState.editorState.startKey ||
      this.state.editorState.startOffset !== nextState.editorState.startOffset;
  };

  handleNewValue(value) {
    let editorState = Plain.deserialize(value);
    let nodes = editorState.document.nodes.asMutable();
    let nodesSize = nodes.size;
    for (let i = 0; i < nodesSize; i++) {
      this.setDataToNode(nodes, i);
    }
    editorState = this.setNodesToState(editorState, nodes);
    this.setState({ editorState });
  }

  setDataToNode(nodes, numBlock, text) {
    const currNode = nodes.get(numBlock).asMutable();
    text = text || currNode.nodes.get(0).text; // eslint-disable-line
    currNode.data = {
      text,
      tokens: parse(text),
    };
    nodes.set(numBlock, currNode.asImmutable());
  }

  setNodesToState(editorState, nodes) {
    let editorStateMutable = editorState.asMutable();
    editorStateMutable.document = editorStateMutable.document.asMutable();
    editorStateMutable.document.nodes = nodes.asImmutable();
    editorStateMutable.document = editorStateMutable.document.asImmutable();
    return editorStateMutable.asImmutable();
  }

  handleChange = (obj) => {
    // XXX Slate "Editor.props.onChange" behavior changed
    // https://github.com/ianstormtaylor/slate/blob/master/packages/slate/Changelog.md#0220--september-5-2017
    let editorState = obj.state || obj;

    let numBlock = -1;
    let key = editorState.blocks.get(0).key;
    let nodesSize = editorState.document.nodes.size;
    for (let i = 0; i < nodesSize; i++) {
      if (key === editorState.document.nodes.get(i).key) {
        numBlock = i;
        break;
      }
    }

    if (numBlock !== -1) {
      let text = editorState.texts.get(0).text;
      let nodes = editorState.document.nodes.asMutable();
      this.setDataToNode(nodes, numBlock, text);
      editorState = this.setNodesToState(editorState, nodes);
    }
    this.props.onChange(Plain.serialize(editorState));

    this.setState({ editorState });

    setTimeout(() => {
      autoScrollToTop();
    }, 0);
  };

  handleMouseDown = () => {
    this.forceUpdate();
  };

  handleFullScreen = () => {
    let fullScreen = !this.state.fullScreen;

    document.body.style.overflow = fullScreen ? 'hidden' : this.initialBodyOverflowStyle;

    this.setState({ fullScreen });
    this.props.onFullScreen(fullScreen);
  };

  handleKeyDown(event, data, state, editor) {
    return shortcuts(event, data, state, editor);
  }

  handleCopy(event, data, change) {
    copySelectionToClipboard(event, change);
    return change;
  }

  handleCut(event, data, change) {
    copySelectionToClipboard(event, change);
    let { state } = change;
    let { selection } = state;
    change.deleteAtRange(selection);
    return change;
  }

  handleRef(ref) {
    this.slateContentRef = ref;
  }

  handleScroll() {
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
      // Works in the modal mode only in IE
      // In other browsers interception of focus does not work in the modal mode
      this.slateContentRef.focus();
    } else {
      // This code in case of execution in IE as a ghost effect scrolls the content of the block to the top
      let refEl = findDOMNode(this.slateContentRef);
      refEl.getElementsByClassName('react-markdown--slate-content__editor')[0].focus();
    }
  }

  render() {
    const { editorState, fullScreen } = this.state;
    const { children, extensions, readOnly } = this.props;

    let objectReferenceButtons = this.props.extensions.map((extension, index) => {
      return (
        <ObjectReferenceButton
          key={index}
          extension={extension}
          disabled={readOnly}
        />
      );
    });

    return (
      <SlateEditor
        state={editorState}
        fullScreen={fullScreen}
        schema={schema}
        onChange={this.handleChange}
        onCopy={this.handleCopy}
        onCut={this.handleCut}
        onKeyDown={this.handleKeyDown}
        plugins={[
          AutocompletePlugin({
            extensions: extensions,
            onChange: this.handleChange,
            onMouseDown: this.handleMouseDown,
            onScroll: this.handleScroll
          })
        ]}
        readOnly={readOnly}
      >
        <SlateToolbar>
          <SlateToolbarGroup>
            <BoldButton disabled={readOnly} />
            <ItalicButton disabled={readOnly} />
            <StrikethroughButton disabled={readOnly} />
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <LinkButton disabled={readOnly} />
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <div title="Insert header">
              <DropdownButton
                id="oc-md--toolbar__headers-dropdown"
                title={<i className="fa fa-header"/>}
                disabled={hasMultiLineSelection(editorState) || readOnly}
              >
                <HeaderOneButton state={editorState} onChange={this.handleChange}/>
                <HeaderTwoButton state={editorState} onChange={this.handleChange}/>
                <HeaderThreeButton state={editorState} onChange={this.handleChange}/>
                <HeaderFourButton state={editorState} onChange={this.handleChange}/>
                <HeaderFiveButton state={editorState} onChange={this.handleChange}/>
                <HeaderSixButton state={editorState} onChange={this.handleChange}/>
              </DropdownButton>
            </div>
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            <OrderedListButton disabled={readOnly} />
            <UnorderedListButton disabled={readOnly} />
          </SlateToolbarGroup>

          <SlateToolbarGroup>
            {objectReferenceButtons}
          </SlateToolbarGroup>

          <SlateToolbarGroup className="react-markdown--plain-markdown-input__fullscreen-button">
            <FullScreenButton onClick={this.handleFullScreen} fullScreen={fullScreen} disabled={readOnly} />
          </SlateToolbarGroup>

          {children}
        </SlateToolbar>
        <SlateContent onRef={this.handleRef} />
      </SlateEditor>
    );
  }
}

PlainMarkdownInput.propTypes = {
  extensions: Types.array,
  value: Types.string,
  onChange: Types.func,
  onFullScreen: Types.func,
  readOnly: Types.bool
};

PlainMarkdownInput.defaultProps = {
  extensions: [],
  value: '',
  onFullScreen: () => {},
  onChange: () => {},
  readOnly: false
};

export default PlainMarkdownInput;
