import React, { Component, PropTypes } from 'react';
import { Editor, EditorState, Modifier } from 'draft-js';
import AutocompleteItemsList from './AutocompleteItemsList.react';

const propTypes = {
  onChange: PropTypes.func,
  autocomplete: PropTypes.object
};
const defaultProps = {
  onChange: () => {},
  autocomplete: []
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

  handleQueryReturn = (selectedIndex, selection) => {
    const { editorState } = this.state;

    const contentStateWithEntity = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      this.state.filteredItems[selectedIndex],
      null,
      null
    );
    const nextEditorState = EditorState.push(
      editorState, contentStateWithEntity, 'apply-entity'
    );
    this.setState({ editorState: nextEditorState });
  };

  getQueryRange = () => {
    let anchorKey = this.state.editorState.getSelection().getAnchorKey();
    let currentContent = this.state.editorState.getCurrentContent();
    let currentContentBlock = currentContent.getBlockForKey(anchorKey);
    let text = currentContentBlock.getText();

    if (text === '') {
      return null;
    }

    let selection = this.state.editorState.getSelection();

    // Remove text that appears after the cursor
    text = text.substring(0, selection.getStartOffset());

    let specialCharacterIndex = -1;
    Object.keys(this.props.autocomplete).forEach((character) => {
      let index = text.lastIndexOf(character);
      if (text.lastIndexOf(character) > specialCharacterIndex) {
        specialCharacterIndex = index;
      }
    });

    if (specialCharacterIndex === -1) {
      return null;
    }
    text = text.substring(specialCharacterIndex);

    return {
      text,
      start: specialCharacterIndex,
      end: selection.getStartOffset()
    };
  };

  getQueryState = (invalidate = true) => {
    if (!invalidate) {
      return this.state.queryState;
    }

    const queryRange = this.getQueryRange();
    if (!queryRange) {
      this.setState({ queryState: null });
      return null;
    }

    if (window.getSelection().anchorNode && this.state.editorState.getSelection().getHasFocus()) {
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
    } else {
      return this.state.queryState
    }
  };

  normalizeSelectedIndex = (selectedIndex, max) => {
    let index = selectedIndex % max;
    if (index < 0) {
      index += max;
    }
    return index;
  };

  filterItems = (values, query) => {
    return values.filter(value => {
      return value.toLowerCase().startsWith(query.toLowerCase());
    });
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    window.requestAnimationFrame(() => {
      let queryState = this.getQueryState();
      if (this.state.queryState && this.state.filteredItems.length &&
        !this.state.editorState.getSelection().getHasFocus()) {  // don't change AutocompleteItemsList position if it's displayed
        queryState = {
          ...this.state.queryState,
          text: queryState.text
        }
      }
      let filteredItems = [];
      if (queryState) {
        let specialCharacter = Object.keys(this.props.autocomplete).find((key) => {
          return queryState.text.includes(key)
        });
        filteredItems = this.filterItems(
          this.props.autocomplete[specialCharacter],
          queryState.text.replace(specialCharacter, '')
        );
      }
      this.setState({ queryState, filteredItems });
    });
  };

  onEscape = (e) => {
    if (!this.getQueryState(false)) {
      return;
    }
    e.preventDefault();
    this.setState({ queryState: null });
  };

  onArrow = (e, shift) => {
    let queryState = this.getQueryState(false);

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

  handleReturn = (e) => {
    if (this.state.queryState && this.state.filteredItems.length) {
      this.onItemSelect(this.state.queryState.selectedIndex);
      return true;
    }
    return false;
  };

  onItemSelect = (selectedIndex) => {
    const contentState = this.state.editorState.getCurrentContent();
    const selection = contentState.getSelectionAfter();
    let anchorSelection = selection.set(
      'anchorOffset', this.state.editorState.getSelection().getFocusOffset() - this.state.queryState.text.length
    );
    let anchorFocusSelection = anchorSelection.set(
      'focusOffset', this.state.editorState.getSelection().getFocusOffset()
    );
    this.handleQueryReturn(selectedIndex, anchorFocusSelection);

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
    if (this.state.queryState === null || this.state.filteredItems.length === 0) {
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
    minHeight: 80,
    padding: 10,
    border: '1px solid #ccc'
  }
};
