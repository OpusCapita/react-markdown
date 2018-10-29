import React, { PureComponent } from 'react';
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

import FocusBlur from './FocusBlur.react';

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

class PlainMarkdownInput extends PureComponent {
  static propTypes = {
    extensions: Types.array,
    additionalButtons: Types.array,
    value: Types.string,
    onChange: Types.func,
    onBlur: Types.func,
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
    readOnly: false,
    autoFocus: true,
    showFullScreenButton: false,
    locale: 'en'
  }

  state = {
    editorState: '',
    fullScreen: false,
    isActive: true // for fix about widget position: hide widget if editor is not focused currently
  }

  componentWillMount() {
    this.initialBodyOverflowStyle = document.body.style.overflow;
    this.handleNewValue(this.props.value);
  }

  componentDidMount() {
    this.setState({ containerRef: this.container }) // eslint-disable-line react/no-did-mount-set-state
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.handleNewValue(nextProps.value);
    }
  }

  isAutocompleteShow = false

  /**
   * handleNewValue
   *
   * @param {string} value - Editor's text. The line's ends in a text editor should be \n - Unix mode(LF)
   */
  handleNewValue = value => {
    let editorState = Plain.deserialize(value);
    const nodes = editorState.document.nodes.asMutable();
    const nodesSize = nodes.size;
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
    const change = this.state.editorState.change();
    change.focus();
    this.setState({ editorState: change.state });
  };

  setNodesToState(editorState, nodes) {
    const editorStateMutable = editorState.asMutable();
    editorStateMutable.document = editorStateMutable.document.asMutable();
    editorStateMutable.document.nodes = nodes.asImmutable();
    editorStateMutable.document = editorStateMutable.document.asImmutable();
    return editorStateMutable.asImmutable();
  }

  handleChange = (obj, isSetFocus = false) => {
    // XXX Slate "Editor.props.onChange" behavior changed
    // https://github.com/ianstormtaylor/slate/blob/master/packages/slate/Changelog.md#0220--september-5-2017
    let editorState = obj.state || obj;
    const selection = copySelection(editorState);
    let numBlock = -1;
    const key = editorState.blocks.get(0).key;
    const nodesSize = editorState.document.nodes.size;
    for (let i = 0; i < nodesSize; i++) {
      if (key === editorState.document.nodes.get(i).key) {
        numBlock = i;
        break;
      }
    }

    if (numBlock !== -1) {
      const text = editorState.texts.get(0).text;
      const nodes = editorState.document.nodes.asMutable();
      this.setDataToNode(nodes, numBlock, text);
      editorState = this.setNodesToState(editorState, nodes);
    }

    // Slate emits onChange not only when text changes,
    // but also when caret changes position or editor gains/loses focus.
    // Slate needs this because it's inner state essentially changes,
    // (cursor position, focused status, etc), but we need to emit only real changes in text value.
    const oldValue = Plain.serialize(this.state.editorState);
    const newValue = Plain.serialize(editorState);
    if (oldValue !== newValue) {
      this.props.onChange(newValue);
    }

    this.setState({ editorState });

    setTimeout(() => {
      autoScrollToTop();
      if (isSetFocus) {
        const editorState = setSelectionToState(this.state.editorState, selection);
        this.setState({ editorState });
      }
    }, 0);
  };

  handleFullScreen = () => {
    const fullScreen = !this.state.fullScreen;

    document.body.style.overflow = fullScreen ? 'hidden' : this.initialBodyOverflowStyle;

    this.setState({ fullScreen });
    this.props.onFullScreen(fullScreen);
  };

  toggleAccent = (state, accent) => this.handleChange(
    hasAccent(state, accent) ? unwrapAccent(state, accent) : wrapAccent(state, accent),
    true
  );

  handleEnterFromListDown(change, accent) { // eslint-disable-line
    const lineText = change.state.texts.get(0).text;
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
    const pasteText = window.clipboardData.getData("Text");
    const txtArr = pasteText.split('\n');
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
      const state = change.state;
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

  focus = () => {
    if (this.slateContentRef) {
      this.slateContentRef.focus();
    }
  }

  handleScroll = () => {
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
      // Works in the modal mode only in IE
      // In other browsers interception of focus does not work in the modal mode
      // (XXX: autocomplete widget loses focus after click on autocomplete scroll,
      // as a result pressing the Up Arrow and Down Arrow buttons cease to be processed)
      this.focus();
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
    const change = this.state.editorState.change();
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
  );

  handleBlur = event => {
    if (event && event.persist) {
      event.persist();
    }
    this.setState(prevState => {
      const change = prevState.editorState.change();
      change.blur();
      return ({
        editorState: change.state,
        ...(prevState.isActive && { isActive: false })
      })
    }, _ => this.props.onBlur(event));
  }

  handleFocus = _ => this.setState(prevState => {
    const change = prevState.editorState.change();
    change.focus();
    return ({
      editorState: change.state,
      ...(!prevState.isActive && { isActive: true })
    })
  });

  render() {
    const { editorState, fullScreen } = this.state;
    const { children, extensions, readOnly, locale, autoFocus, hideToolbar } = this.props;
    const disabled = readOnly || hasMultiLineSelection(editorState);

    // Create buttons for toolbar
    const emphasisButtons = this.getAccentButtons({
      editorValue: editorState, disabled, locale, accents: ['bold', 'italic', 'strikethrough']
    });
    const linkButton = this.getLinkButton({ disabled, locale });
    const headerButtons = this.getHeaderButtons({ disabled, locale });
    const listButtons = this.getAccentButtons({
      editorValue: editorState, disabled: readOnly, locale, accents: ['ol', 'ul']
    });
    const additionalButtons = this.getAdditionalButtons(readOnly);
    const fullScreenButton = this.getFullScreenButton({ readOnly, locale, fullScreen });

    const editor = (
      <Editor
        spellCheck={false}
        state={editorState}
        fullScreen={fullScreen}
        autoFocus={autoFocus}
        schema={schema}
        onChange={this.handleChange}
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
            onToggle: this.handleAutocompleteToggle,
            editorIsActive: this.state.isActive,
            containerRef: this.state.containerRef
          })
        ]}
        readOnly={readOnly}
        className={`react-markdown--slate-content__editor`}
        ref={this.handleRef}
      >
        {children}
      </Editor>
    );

    return (
      <FocusBlur onBlur={this.handleBlur} onFocus={this.handleFocus}>
        <div
          className={classnames(
            'react-markdown--slate-editor',
            { 'react-markdown--slate-editor--fullscreen': fullScreen }
          )}
          ref={el => (this.container = el)}
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
            {editor}
          </div>
        </div>
      </FocusBlur>
    );
  }
}

export default PlainMarkdownInput;
