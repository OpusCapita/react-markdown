import React from 'react';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import Types from 'prop-types';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import schema from './slate/schema';
import shortcuts from './slate/shortcuts';
// import { hasMultiLineSelection } from './slate/transforms';
import './PlainMarkdownInput.less';
import { parse } from './slate/tokenizer';
import { autoScrollToTop } from '../utils';
import getMessage from '../translations';

import {
  AutocompletePlugin,
  FullScreenButton,
  ObjectReferenceButton
} from '../SlateEditor/plugins';

import {
  ActionButton,
  HeaderButton,
  LinkButton,
} from './buttons';

import {
  hasAccent,
  wrapAccent,
  unwrapAccent,
  hasMultiLineSelection
} from './slate/transforms';

import { SlateContent, SlateEditor } from '../SlateEditor';
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
    this.handleRef = this.handleRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClickButton = this.handleClickButton.bind(this);
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
    // XXX
    // for only modal mode
    return this.state.editorState.endKey !== nextState.editorState.endKey ||
      this.state.editorState.endOffset !== nextState.editorState.endOffset ||
      this.state.editorState.startKey !== nextState.editorState.startKey ||
      this.state.editorState.startOffset !== nextState.editorState.startOffset ||
      this.state.fullScreen !== nextState.fullScreen ||
      this.state.editorState.texts.get(0).text !== nextState.editorState.texts.get(0).text ||
      this.props.readOnly !== nextProps.readOnly ||
      this.props.value !== nextProps.value ||
      this.props.onFullScreen !== nextProps.onFullScreen ||
      this.props.locale !== nextProps.locale ||
      this.props.onChange !== nextProps.onChange ||
      !_.isEqual(this.props.extensions, nextProps.extensions);
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

  handleClickButton(accent) {
    const state = this.state.editorState;
    const active = hasAccent(state, accent);

    return this.handleChange(active ? unwrapAccent(state, accent) : wrapAccent(state, accent));
  }

  render() {
    const { editorState, fullScreen } = this.state;
    const { children, extensions, readOnly, locale } = this.props;

    let objectReferenceButtons = this.props.extensions.map((extension, index) => {
      return (
        <ObjectReferenceButton
          state={editorState}
          onChange={this.handleChange}
          key={index}
          extension={extension}
          disabled={readOnly}
          locale={locale}
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
            locale: locale,
            onChange: this.handleChange,
            onMouseDown: this.handleMouseDown,
            onScroll: this.handleScroll
          })
        ]}
        readOnly={readOnly}
      >
        <div className="react-markdown--toolbar">
          <div className="btn-group">
            {['bold', 'italic', 'strikethrough'].map(accent => (
              <ActionButton
                key={accent}
                // state={editorState}
                // onChange={this.handleChange}
                onClick={this.handleClickButton}
                disabled={readOnly || hasMultiLineSelection(editorState)}
                locale={locale}
                accent={accent}
                active={hasAccent(editorState, accent)}
              />
            ))}
          </div>

          <div className="btn-group">
            <LinkButton state={editorState} onChange={this.handleChange} disabled={readOnly} locale={locale} />
          </div>

          <div className="btn-group" title={getMessage(locale, 'insertHeader')}>
            <DropdownButton
              id="oc-md--toolbar__headers-dropdown"
              title={<i className="fa fa-header"/>}
              disabled={hasMultiLineSelection(editorState) || readOnly}
            >
              {[1, 2, 3, 4, 5, 6].map(level => (
                <HeaderButton key={level} state={editorState} onChange={this.handleChange} level={level} />
              ))}
            </DropdownButton>
          </div>

          <div className="btn-group">
            {['ol', 'ul'].map(accent => (
              <ActionButton
                // key={accent}
                // state={editorState}
                // onChange={this.handleChange}
                // disabled={readOnly}
                // locale={locale}
                // accent={accent}
                key={accent}
                onClick={this.handleClickButton}
                disabled={readOnly || hasMultiLineSelection(editorState)}
                locale={locale}
                accent={accent}
                active={hasAccent(editorState, accent)}
              />
            ))}
          </div>

          <div className="btn-group">
            {objectReferenceButtons}
          </div>

          <div className="btn-group react-markdown--plain-markdown-input__fullscreen-button">
            <FullScreenButton
              onClick={this.handleFullScreen}
              locale={locale}
              fullScreen={fullScreen}
              disabled={readOnly}
            />
          </div>

          {children}
        </div>
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
  readOnly: Types.bool,
  locale: Types.string
};

PlainMarkdownInput.defaultProps = {
  extensions: [],
  value: '',
  onFullScreen: () => {},
  onChange: () => {},
  readOnly: false,
  locale: 'en'
};

export default PlainMarkdownInput;
