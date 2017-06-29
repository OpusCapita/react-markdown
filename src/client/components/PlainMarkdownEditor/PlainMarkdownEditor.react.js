import React, { Component, PropTypes } from 'react';
import Promise from 'bluebird';
import { Editor, EditorState, Modifier, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import AutocompleteItemsList from './AutocompleteItemsList.react';

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  autocompletes: PropTypes.array
};
const defaultProps = {
  onChange: () => {},
  value: "",
  autocompletes: []
};

export default
class PlainMarkdownEditor extends Component {

  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      queryState: null,
      filteredItems: []
    };
  }

  componentWillMount() {
    this.updateEditorText(this.props.value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.updateEditorText(nextProps.value);
    }
  }

  updateEditorText = (value, editorState = this.state.editorState) => {
    const selection = editorState.getSelection();
    let selectionForReplacement = this.createNewSelection(0, value.length);

    const modifiedContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selectionForReplacement,
      value,
      null,
      null
    );
    const contentStateWithCorrectedSelection = Modifier.replaceText(  // set up correct focus position
      modifiedContentState,
      this.createNewSelection(selection.getEndOffset(), selection.getEndOffset()),
      '',
      null,
      null
    );
    const nextEditorState = EditorState.push(
      editorState, contentStateWithCorrectedSelection, null
    );
    this.setState({ editorState: nextEditorState });
  };

  createNewSelection = (anchorOffset, focusOffset) => {
    return this.state.editorState.getSelection().set(
      'anchorOffset', anchorOffset
    ).set(
      'focusOffset', focusOffset
    );
  };

  getAutocomplete = () => {
    let { editorState } = this.state;
    let text = editorState.getCurrentContent().getPlainText();
    let autocomplete = this.props.autocompletes.find((autocomplete) => {
      return text.search(autocomplete.termRegex) !== -1;
    });
    if (autocomplete) {
      let selection = editorState.getSelection();
      // text before caret
      text = text.substring(0, selection.getStartOffset());
      autocomplete.termRegex.test(text);
      return text.endsWith(RegExp.lastMatch) ? autocomplete : null;
    }
    return null;
  };

  getAutocompleteItems = (term) => {
    let autocomplete = this.getAutocomplete();
    return autocomplete ? autocomplete.fetch(term) : Promise.resolve([])
  };

  handleQueryReturn = (selectedIndex, selection) => {
    let { editorState } = this.state;
    let textForInsertion = this.getAutocomplete().selectItem(this.state.filteredItems[selectedIndex]);

    const modifiedContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      textForInsertion,
      null,
      null
    );

    const nextEditorState = EditorState.push(
      editorState, modifiedContentState, null
    );
    this.setState({ editorState: nextEditorState, filteredItems: [], queryState: null }, this.onChange.bind(this, nextEditorState));
  };

  getQueryRange = () => {
    let autocomplete = this.getAutocomplete();
    if (!autocomplete) {
      return null;
    }

    let text = this.state.editorState.getCurrentContent().getPlainText();
    let selection = this.state.editorState.getSelection();
    // text before caret
    text = text.substring(0, selection.getStartOffset());

    autocomplete.termRegex.test(text);
    let specialCharacterIndex = text.lastIndexOf(RegExp.lastMatch);
    text = text.substring(specialCharacterIndex);

    return {
      text,
      start: specialCharacterIndex,
      end: this.state.editorState.getSelection().getStartOffset()
    };
  };

  getRefreshedQueryState = () => {
    const queryRange = this.getQueryRange();
    if (!queryRange) {
      this.setState({ queryState: null });
      return null;
    }

    let selection = this.state.editorState.getSelection();
    if (window.getSelection().anchorNode && selection.getHasFocus()) {
      let tempRange = window.getSelection().getRangeAt(0).cloneRange();
      tempRange.setStart(tempRange.startContainer, queryRange.start);
      let rangeRect = tempRange.getBoundingClientRect();
      let [left, top] = [rangeRect.left, rangeRect.bottom];
      return {
        left,
        top,
        text: queryRange.text,
        selectedIndex: 0
      }
    }
    return this.state.queryState
  };

  normalizeSelectedIndex = (selectedIndex, max) => {
    let index = selectedIndex % max;
    if (index < 0) {
      index += max;
    }
    return index;
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    window.requestAnimationFrame(() => {
      this.refs.editor.focus();
      let queryState = this.getRefreshedQueryState();
      if (this.state.queryState) {
        queryState = {
          ...this.state.queryState,
          text: queryState.text
        }
      }
      if (queryState) {
        this.getAutocompleteItems(queryState.text).then((filteredItems) => {
          this.setState({ filteredItems })
        });
      }
      this.setState({ queryState });
      let currentValue = this.state.editorState.getCurrentContent().getPlainText();
      if (this.props.value !== currentValue) {
        this.props.onChange(currentValue);
      }
    });
  };

  onEscape = (e) => {
    if (!this.state.queryState) {
      return;
    }
    e.preventDefault();
    this.setState({ queryState: null });
  };

  onArrow = (e, shift) => {
    let { queryState } = this.state;

    if (!queryState || this.state.filteredItems.length === 0) {
      return;
    }

    e.preventDefault();
    queryState.selectedIndex = this.normalizeSelectedIndex(
      queryState.selectedIndex + shift,
      this.state.filteredItems.length
    );
    this.setState({ queryState });
  };

  onUpArrow = (e) => {
    this.onArrow(e, -1);
  };

  onDownArrow = (e) => {
    this.onArrow(e, 1);
  };

  handleNewLine = () => {
    let { editorState } = this.state;
    let selectionForReplacement = this.createNewSelection(
      editorState.getSelection().getEndOffset(),
      editorState.getSelection().getEndOffset()
    );

    const modifiedContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selectionForReplacement,
      '\n',
      null,
      null
    );
    let modifiedValue = modifiedContentState.getPlainText();
    this.props.onChange(modifiedValue);
    let correctedSelection = this.createNewSelection(
      selectionForReplacement.getEndOffset() + 1,
      selectionForReplacement.getEndOffset() + 1
    );
    const correctedSelectionContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      correctedSelection,
      '',
      null,
      null
    );

    const nextEditorState = EditorState.push(
      editorState, correctedSelectionContentState, null
    );
    this.setState({ editorState: nextEditorState }, this.updateEditorText.bind(this, modifiedValue, nextEditorState));
  };

  handleReturn = () => {
    if (this.state.queryState) {
      if (this.state.filteredItems.length) {
        this.onItemSelect(this.state.queryState.selectedIndex);
      }
      return true;
    }
    this.handleNewLine();
    return true;
  };

  onItemSelect = (selectedIndex) => {
    let replacementSelection = this.createNewSelection(
      this.state.editorState.getSelection().getEndOffset() - this.state.queryState.text.length,
      this.state.editorState.getSelection().getEndOffset()
    );
    this.handleQueryReturn(selectedIndex, replacementSelection);

    this.setState({ queryState: null })
  };

  onItemMouseMove = (selectedIndex) => {
    let queryState = {
      ...this.state.queryState,
      selectedIndex
    };
    this.setState({ queryState })
  };

  renderAutocompleteItemsList = () => {
    if (!this.state.queryState) {
      return null;
    }

    let { left, top, selectedIndex } = this.state.queryState;
    return (
      <AutocompleteItemsList
        left={left}
        top={top}
        items={this.state.filteredItems}
        selectedIndex={selectedIndex}
        onItemClick={this.onItemSelect}
        onItemMouseMove={this.onItemMouseMove}
      />
    );
  };

  render() {
    return (
      <div>
        {this.renderAutocompleteItemsList()}
        <div style={styles.editor}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            onEscape={this.onEscape}
            onUpArrow={this.onUpArrow}
            onDownArrow={this.onDownArrow}
            handleReturn={this.handleReturn}
            ref="editor"
          />
        </div>
      </div>
    );
  }
}

PlainMarkdownEditor.propTypes = propTypes;
PlainMarkdownEditor.defaultProps = defaultProps;

const styles = {
  editor: {
    padding: 10,
    border: '1px solid #ccc'
  }
};
