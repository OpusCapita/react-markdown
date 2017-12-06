import React from 'react';
import { findDOMNode } from 'react-dom';
import Types from 'prop-types';
import classnames from 'classnames';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import schema from './slate/schema';
import './PlainMarkdownInput.less';
import { parse } from './slate/tokenizer';
import getMessage from '../translations';

import {
  autoScrollToTop
} from './utils';

import { AutocompletePlugin } from './plugins';

import {
  ActionButton,
  HeaderButton,
  LinkButton,
  FullScreenButton
} from './buttons';

import {
  hasAccent,
  wrapAccent,
  unwrapAccent,
  hasHeader,
  wrapHeader,
  unwrapHeader,
  wrapLink,
  hasMultiLineSelection,
  getOlNum,
  getUlMarker,
  copySelection,
  setSelectionToState,
  addSpecialCharacter
} from './slate/transforms';

const ACCENTS = {
  b: 'bold',
  i: 'italic',
  s: 'strikethrough'
};

export const getCopyText = state => {
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
};

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
    this.handleRef = this.handleRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleActionButtonClick = this.handleActionButtonClick.bind(this);
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

  handleMouseDown = () => {
    this.forceUpdate();
  };

  handleMouseUp = () => {
    let change = this.state.editorState.change();
    change.focus();
    this.setState({ editorState: change.state });
  };

  setNodesToState(editorState, nodes) {
    let editorStateMutable = editorState.asMutable();
    editorStateMutable.document = editorStateMutable.document.asMutable();
    editorStateMutable.document.nodes = nodes.asImmutable();
    editorStateMutable.document = editorStateMutable.document.asImmutable();
    return editorStateMutable.asImmutable();
  }

  handleChange = (obj, isSetFocus = false) => {
    // XXX Slate "Editor.props.onChange" behavior changed
    // https://github.com/ianstormtaylor/slate/blob/master/packages/slate/Changelog.md#0220--september-5-2017
    let editorState = obj.state || obj;
    let selection = copySelection(editorState);
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
      if (isSetFocus) {
        let editorState = setSelectionToState(this.state.editorState, selection);
        this.setState({ editorState });
      }
    }, 0);
  };

  handleFullScreen = () => {
    let fullScreen = !this.state.fullScreen;

    document.body.style.overflow = fullScreen ? 'hidden' : this.initialBodyOverflowStyle;

    this.setState({ fullScreen });
    this.props.onFullScreen(fullScreen);
  };

  toggleAccent(state, accent) {
    const active = hasAccent(state, accent);
    return this.handleChange(active ? unwrapAccent(state, accent) : wrapAccent(state, accent), true);
  }

  handleEnterFromListDown(change, accent) { // eslint-disable-line
    let lineText = change.state.texts.get(0).text;
    let text, listMarker, pref, itemNum, div;
    if (accent === 'ul') {
      listMarker = getUlMarker(lineText);
      if (listMarker) {
        text = listMarker;
      } else {
        text = '* ';
      }
    } else {
      ({ pref, itemNum, div, listMarker } = getOlNum(lineText));
      text = `${pref}${++itemNum}${div} `;
    }

    if (lineText.trim() === listMarker.trim()) {
      change.moveStart(-text.length).delete();
      return this.handleChange(change.state);
    }

    setTimeout(() => {
      const { editorState } = this.state;
      change = editorState.change(); // eslint-disable-line
      change.insertText(text);
      this.handleChange(change.state);
    }, 5);
  }

  handlePaste(event, change) {
    if (!window.clipboardData) { // for chrome and ff
      return undefined;
    }

    event.preventDefault();
    let pasteText = window.clipboardData.getData("Text");
    let txtArr = pasteText.split('\n');
    if (txtArr.length > 1) { // insert multiline text
      for (let i = 0; i < txtArr.length; i++) {
        change.insertText(txtArr[i]);
        if (i < txtArr.length - 1) {
          change.splitBlock(1);
        }
      }
    } else {
      change.insertText(pasteText);
    }
    change.focus();
    return this.handleChange(change.state);
  }

  handleKeyDown(event, data, change) {
    if (data.isMod && data.key === 'v') {
      return this.handlePaste(event, change);
    }

    if (data.isMod && ACCENTS[data.key]) {
      if (data.key === 's') {
        event.preventDefault();
      }
      return this.toggleAccent(change.state, ACCENTS[data.key]);
    }

    if (data.key === 'enter') {
      let state = change.state;
      if (hasAccent(state, 'ul')) {
        return this.handleEnterFromListDown(change, 'ul');
      } else if (hasAccent(state, 'ol')) {
        return this.handleEnterFromListDown(change, 'ol');
      }
    }

    return undefined;
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
    let refEl = findDOMNode(this.slateContentRef);
    refEl.getElementsByClassName('react-markdown--slate-content__editor')[0].focus();
  }

  handleActionButtonClick(accent) {
    const state = this.state.editorState;
    return this.toggleAccent(state, accent);
  }

  handleHeaderButtonClick(level) {
    const state = this.state.editorState;
    const active = hasHeader(state, level);
    return this.handleChange(active ? unwrapHeader(state, level) : wrapHeader(state, level));
  }

  handleLinkButtonClick() {
    const state = this.state.editorState;
    return this.handleChange(wrapLink(state));
  }

  handleObjectReferenceButtonClick(extension) {
    const state = this.state.editorState;
    return this.handleChange(addSpecialCharacter(extension.specialCharacter, state));
  }

  render() {
    const { editorState, fullScreen } = this.state;
    const { children, extensions, readOnly, locale } = this.props;
    const disabled = readOnly || hasMultiLineSelection(editorState);

    return (
      <div
        className={classnames(
          'react-markdown--slate-editor',
          { 'react-markdown--slate-editor--fulscreen': fullScreen }
        )}
      >
        <div className="react-markdown--toolbar">
          <div className="btn-group">
            {['bold', 'italic', 'strikethrough'].map((accent, ind) => (
              <ActionButton
                key={ind}
                onClick={this.handleActionButtonClick}
                disabled={disabled}
                locale={locale}
                accent={accent}
                active={hasAccent(editorState, accent)}
              />
            ))}
          </div>

          <div className="btn-group">
            <LinkButton
              onClick={this.handleLinkButtonClick.bind(this)}
              disabled={disabled}
              locale={locale}
            />
          </div>

          <div className="btn-group" title={getMessage(locale, 'insertHeader')}>
            <DropdownButton
              id="oc-md--toolbar__headers-dropdown"
              title={<i className="fa fa-header"/>}
              disabled={disabled}
            >
              {[1, 2, 3, 4, 5, 6].map((level, ind) => (
                <HeaderButton
                  key={ind}
                  onClick={this.handleHeaderButtonClick.bind(this)}
                  level={level}
                />
              ))}
            </DropdownButton>
          </div>

          <div className="btn-group">
            {['ol', 'ul'].map((accent, ind) => (
              <ActionButton
                key={ind}
                onClick={this.handleActionButtonClick}
                disabled={readOnly}
                locale={locale}
                accent={accent}
                active={hasAccent(editorState, accent)}
              />
            ))}
          </div>

          <div className="btn-group react-markdown--plain-markdown-input__fullscreen-button">
            <FullScreenButton
              onClick={this.handleFullScreen}
              locale={locale}
              fullScreen={fullScreen}
              disabled={readOnly}
            />
          </div>
        </div>
        <div className={'react-markdown--slate-content'}>
          <Editor
            spellCheck={false}
            state={editorState}
            fullScreen={fullScreen}
            schema={schema}
            onChange={this.handleChange}
            onCopy={this.handleCopy}
            onCut={this.handleCut}
            onKeyDown={this.handleKeyDown.bind(this)}
            plugins={[
              AutocompletePlugin({
                extensions: extensions,
                locale: locale,
                onChange: this.handleChange,
                onScroll: this.handleScroll,
                onMouseUp: this.handleMouseUp
              })
            ]}
            readOnly={readOnly}
            className={`react-markdown--slate-content__editor`}
            ref={this.handleRef}
          >
            {children}
          </Editor>
        </div>
      </div>
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
