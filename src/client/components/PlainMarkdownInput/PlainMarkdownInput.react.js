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
import { autoScrollToTop } from './utils';
import { AutocompletePlugin } from './plugins';

import {
  AdditionalButton,
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
} from './slate/transforms';

const ACCENTS = {
  b: 'bold',
  i: 'italic',
  s: 'strikethrough'
};

export const getCopyText = ({ startKey, startOffset, endKey, endOffset, texts }) => startKey === endKey ?
  texts.get(0).text.slice(startOffset, endOffset) :
  texts.
    map((el, i) => {
      if (i === 0) {
        return el.text.slice(startOffset);
      } else if (i === texts.size - 1) {
        return el.text.slice(0, endOffset);
      } else {
        return el.text;
      }
    }).
    join('\n');

function copySelectionToClipboard(event, { state }) {
  event.preventDefault();
  const copyText = getCopyText(state);

  if (window.clipboardData) {
    window.clipboardData.setData("Text", copyText);
  } else {
    event.clipboardData.setData('text/plain', copyText);
  }
}

class PlainMarkdownInput extends React.Component {
  static propTypes = {
    extensions: Types.array,
    additionalButtons: Types.array,
    value: Types.string,
    onChange: Types.func,
    onBlur: Types.func,
    onFocus: Types.func,
    onFullScreen: Types.func,
    readOnly: Types.bool,
    autoFocus: Types.bool,
    showFullScreenButton: Types.bool,
    locale: Types.string,
    hideToolbar: Types.bool
  }

  static defaultProps = {
    extensions: [],
    additionalButtons: [],
    value: '',
    onFullScreen: () => {},
    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    readOnly: false,
    autoFocus: true,
    showFullScreenButton: false,
    locale: 'en'
  }

  state = {
    editorState: '',
    fullScreen: false,
    isFocused: false
  }

  componentWillMount() {
    this.initialBodyOverflowStyle = document.body.style.overflow;
    this.handleNewValue(this.props.value);
  }

  componentDidMount() {
    /**
     * This setup is needed to create proper `blur` handler.
     * Slate-react Editor has `onBlur` prop, but if we just supply it to Editor component,
     * `blur` will fire when a user clicks buttons B, I etc. But we need `blur` to fire only when
     * component loses focus, and not when we operate with internal elements of editor.
     */
    this.selfDOMNode = findDOMNode(this)
    this.selfDOMNode.addEventListener('focusin', this.handleFocusIn)
    this.selfDOMNode.addEventListener('focusout', this.handleFocusOut)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.handleNewValue(nextProps.value);
    }
  }

  handleFocusIn = event => !this.state.isFocused && this.setState({ isFocused: true }, _ => this.props.onFocus(event));

  handleFocusOut = event => {
    const data = { timeout: null };
    const abortFocusOut = _ => clearTimeout(data.timeout);

    data.timeout = setTimeout(_ => {
      this.selfDOMNode.removeEventListener('focusin', abortFocusOut);
      this.setState({ isFocused: false }, _ => this.props.onBlur(event));
    })

    this.selfDOMNode.addEventListener('focusin', abortFocusOut)
  }

  isAutocompleteShow = false

  /**
   * handleNewValue
   *
   * @param {string} value - Editor's text. The line's ends in a text editor should be \n - Unix mode(LF)
   */
  handleNewValue = value => {
    let editorState = Plain.deserialize(value);
    let nodes = editorState.document.nodes.asMutable();
    let nodesSize = nodes.size;
    for (let i = 0; i < nodesSize; i++) {
      this.setDataToNode(nodes, i);
    }
    editorState = this.setNodesToState(editorState, nodes);
    this.setState({ editorState });
  }

  setDataToNode = (nodes, numBlock, text) => {
    const currNode = nodes.get(numBlock).asMutable();
    text = text || currNode.nodes.get(0).text; // eslint-disable-line
    currNode.data = {
      text,
      tokens: parse(text),
      toJSON: () => text
    };

    nodes.set(numBlock, currNode.asImmutable());
  }

  handleAutocompleteToggle = flag => {
    this.isAutocompleteShow = flag;
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

  toggleAccent = (state, accent) => this.handleChange(
    hasAccent(state, accent) ? unwrapAccent(state, accent) : wrapAccent(state, accent),
    true
  );

  handleEnterFromListDown(change, accent) { // eslint-disable-line
    let lineText = change.state.texts.get(0).text;
    let text, listMarker, pref, itemNum, div;
    if (accent === 'ul') {
      listMarker = getUlMarker(lineText);
      text = listMarker || '* ';
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

  handleKeyDown = (event, data, change) => {
    if (data.isMod && data.key === 'v') {
      return this.handlePaste(event, change);
    }

    if (data.isMod && ACCENTS[data.key]) {
      if (data.key === 's') {
        event.preventDefault();
      }
      return this.toggleAccent(change.state, ACCENTS[data.key]);
    }

    if (data.key === 'enter' && !this.isAutocompleteShow) {
      let state = change.state;
      if (hasAccent(state, 'ul')) {
        return this.handleEnterFromListDown(change, 'ul');
      } else if (hasAccent(state, 'ol')) {
        return this.handleEnterFromListDown(change, 'ol');
      }
    }

    return undefined;
  }

  handleCopy = (event, data, change) => {
    copySelectionToClipboard(event, change);
    return change;
  }

  handleCut = (event, data, change) => {
    copySelectionToClipboard(event, change);
    change.deleteAtRange(change.state.selection);
    return change;
  }

  handleRef = ref => {
    this.slateContentRef = ref;
  }

  handleScroll = () => {
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
      // Works in the modal mode only in IE
      // In other browsers interception of focus does not work in the modal mode
      // (XXX: autocomplete widget loses focus after click on autocomplete scroll,
      // as a result pressing the Up Arrow and Down Arrow buttons cease to be processed)
      this.slateContentRef.focus();
    } else {
      // This code in case of execution in IE as a ghost effect scrolls the content of the block to the top
      findDOMNode(this.slateContentRef).
        getElementsByClassName('react-markdown--slate-content__editor')[0].
        focus();
    }
  }

  handleActionButtonClick = accent => this.toggleAccent(this.state.editorState, accent);

  handleHeaderButtonClick = level => {
    const state = this.state.editorState;
    return this.handleChange(hasHeader(state, level) ?
      unwrapHeader(state, level) :
      wrapHeader(state, level)
    );
  }

  handleLinkButtonClick = () => this.handleChange(wrapLink(this.state.editorState));

  getCurrentText = () => this.state.editorState.document.nodes.toArray().
    map(block => block.text).
    join('\n')

  insertAtCursorPosition = insertedText => {
    let change = this.state.editorState.change();
    change.delete().insertText(insertedText).focus();
    return this.handleChange(change.state, true);
  }

  handleAdditionalButtonsClick = handleButtonPress => {
    handleButtonPress({ value: this.getCurrentText(), insertAtCursorPosition: this.insertAtCursorPosition });
  }

  /**
   * Create additional buttons
   *
   * @param readOnly
   */
  getAdditionalButtons(readOnly) {
    return (
      <div className="btn-group react-markdown--plain-markdown-input__right-buttons">
        {this.props.additionalButtons.map((buttonData, i) => (
          <AdditionalButton
            key={i}
            onClick={this.handleAdditionalButtonsClick}
            settings={buttonData}
            disabled={readOnly}
          />
        ))}
      </div>
    );
  }

  /**
   * Create buttons' group for accents
   *
   * @param editorValue
   * @param disabled
   * @param locale
   * @param accents
   * @returns {*}
   */
  getAccentButtons = ({ editorValue, disabled, locale, accents }) => this.wrapButtonGroup(accents.map((accent, i) => (
    <ActionButton
      key={i}
      onClick={this.handleActionButtonClick}
      disabled={disabled}
      locale={locale}
      accent={accent}
      active={hasAccent(editorValue, accent)}
    />
  )))

  /**
   * Create buttons' group for links
   *
   * @param disabled
   * @param locale
   * @returns {*}
   */
  getLinkButton = ({ disabled, locale }) => this.wrapButtonGroup(
    <LinkButton
      onClick={this.handleLinkButtonClick}
      disabled={disabled}
      locale={locale}
    />
  )

  /**
   * Create buttons' group for headers
   *
   * @param disabled
   * @param locale
   * @returns {*}
   */
  getHeaderButtons = ({ disabled, locale }) => (
    <div className="btn-group" title={getMessage(locale, 'insertHeader')}>
      <DropdownButton
        id="oc-md--toolbar__headers-dropdown"
        title={<i className="fa fa-header"/>}
        disabled={disabled}
      >
        {[1, 2, 3, 4, 5, 6].map((level, i) => (
          <HeaderButton
            key={i}
            onClick={this.handleHeaderButtonClick}
            level={level}
          />
        ))}
      </DropdownButton>
    </div>
  )

  /**
   * Create buttons' group for fullScreenButton
   *
   * @param readOnly
   * @param locale
   * @param fullScreen
   * @returns {string}
   */
  getFullScreenButton = ({ readOnly, locale, fullScreen }) => this.props.showFullScreenButton ?
    (
      <div className="btn-group react-markdown--plain-markdown-input__left-border">
        <FullScreenButton
          onClick={this.handleFullScreen}
          locale={locale}
          fullScreen={fullScreen}
          disabled={readOnly}
        />
      </div>
    ) :
    ''

  /**
   * Wrap buttons' group
   *
   * @param children
   * @returns {*}
   */
  wrapButtonGroup = children => (
    <div className="btn-group">
      {children}
    </div>
  )

  render() {
    const { editorState, fullScreen } = this.state;
    const { children, extensions, readOnly, locale, autoFocus, hideToolbar } = this.props;
    const disabled = readOnly || hasMultiLineSelection(editorState);

    // Create buttons for toolbar
    let emphasisButtons = this.getAccentButtons({
      editorValue: editorState, disabled, locale, accents: ['bold', 'italic', 'strikethrough']
    });
    let linkButton = this.getLinkButton({ disabled, locale });
    let headerButtons = this.getHeaderButtons({ disabled, locale });
    let listButtons = this.getAccentButtons({
      editorValue: editorState, readOnly, locale, accents: ['ol', 'ul']
    });
    let additionalButtons = this.getAdditionalButtons(readOnly);
    let fullScreenButton = this.getFullScreenButton({ readOnly, locale, fullScreen });

    return (
      <div
        className={classnames(
          'react-markdown--slate-editor',
          { 'react-markdown--slate-editor--fulscreen': fullScreen }
        )}
      >
        {
          !hideToolbar && (
            <div className="react-markdown--toolbar">
              {emphasisButtons}
              {linkButton}
              {headerButtons}
              {listButtons}
              {additionalButtons}
              {fullScreenButton}
            </div>
          )
        }

        <div
          className={'react-markdown--slate-content'}
          {...(hideToolbar && { style: { borderTop: '0' } })}
        >
          <Editor
            spellCheck={false}
            state={editorState}
            fullScreen={fullScreen}
            autoFocus={autoFocus}
            schema={schema}
            onChange={this.handleChange}
            // onBlur={this.props.onBlur}
            onCopy={this.handleCopy}
            onCut={this.handleCut}
            onKeyDown={this.handleKeyDown}
            plugins={[
              AutocompletePlugin({
                extensions,
                locale,
                onChange: this.handleChange,
                onScroll: this.handleScroll,
                onMouseUp: this.handleMouseUp,
                onToggle: this.handleAutocompleteToggle
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

export default PlainMarkdownInput;
