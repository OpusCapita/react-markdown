import React from 'react';
import PropTypes from 'prop-types';

import AutocompleteWidget from './AutocompleteWidget';
// what is that???? why???
// polyfile Promise for IE
import 'bluebird';

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

class AutocompleteContainer extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    editor: PropTypes.object,
    options: PropTypes.object
  };

  static defaultProps = {
    state: {},
    editor: {},
    options: {}
  };

  state = {
    show: false,
    selectedIndex: 0,
    isLoading: false,
    isMouseIndexSelected: false,
    items: []
  };

  componentDidMount = () => {
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.searchItems(nextProps);
    if (this.state.selectedIndex &&
      (this.props.state.startOffset === nextProps.state.startOffset) &&
      (this.props.state.startText.text === nextProps.state.startText.text) &&
      nextProps.state.startText.text) {
      this.handleSelectItem(this.state.selectedIndex);
    }
  };

  matchExtension = (extensions, token) => {
    for (let i = 0, count = extensions.length; i < count; i++) {
      const extension = extensions[i];

      if (token.match(extension.termRegex)) {
        return extension;
      }
    }
    return undefined;
  };

  getSearchToken = (state) => {
    const text = state.focusBlock.text;
    const { anchorOffset } = state.selection;

    let term;
    let offset = -1;

    if (text && anchorOffset > 0) {
      term = text.substring(0, anchorOffset);

      if (!term.endsWith(' ')) {
        offset = term.lastIndexOf(' ');

        if (offset !== -1) {
          offset = offset + 1;
          term = term.substring(offset);
        }
      }
    }

    return { term, text, offset };
  };

  handleSelectedIndexChange = (selectedIndex) => {
    if (this.state.isMouseIndexSelected) {
      this.setState({ selectedIndex });
    } else {
      this.setState({ isMouseIndexSelected: true });
    }
  };

  handleKeyDown = (e) => {
    const { show, items, selectedIndex } = this.state;

    if (show && items) {
      if (e.keyCode === escapeCode) {
        e.preventDefault();

        this.setState({ show: false });
      } else if (e.keyCode === enterCode) {
        e.preventDefault();

        this.handleSelectItem(selectedIndex);
      } else if (e.keyCode === arrowUpCode || e.keyCode === arrowDownCode) {
        e.preventDefault();

        this.setState({ isMouseIndexSelected: false });
        const length = items.length;
        if (e.keyCode === arrowDownCode && selectedIndex < length - 1) {
          this.setState({ selectedIndex: selectedIndex + 1 });
        } else if (e.keyCode === arrowUpCode && selectedIndex > 0) {
          this.setState({ selectedIndex: selectedIndex - 1 });
        }
      }
    }
  };

  handleSelectItem = (index) => {
    const { items } = this.state;
    const { state, editor, options } = this.props;
    const { term } = this.getSearchToken(state);

    if (term) {
      const item = items[index];

      const { extensions } = options;
      const extension = this.matchExtension(extensions, term);

      if (extension) {
        let t = state.transform();
        t.deleteBackward(term.length);
        t.insertText(extension.plainMarkdownText(item) + ' ');

        editor.onChange(
          t.focus().
          apply()
        );
      }
    }

    this.setState({ show: false });
  };

  searchItems = ({ state, options }) => {
    let { term } = this.getSearchToken(state);

    if (term) {
      const { extensions } = options;
      const extension = this.matchExtension(extensions, term);
      const { show } = this.state;
      if (extension) {
        this.setState({ show: true, isLoading: true });
        extension.searchItems(term).then((items) => this.setState({ items, selectedIndex: 0, isLoading: false }));
      } else if (show) {
        this.setState({ show: false });
      }
    } else {
      this.setState({ show: false });
    }
  };

  render() {
    const { show, selectedIndex, items, isLoading, isMouseIndexSelected } = this.state;
    const { children, state } = this.props;

    return (
      <div onKeyDown={this.handleKeyDown}>
        {show && state.isFocused ? (
          <AutocompleteWidget
            items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelectItem={this.handleSelectItem}
            onSelectedIndexChange={this.handleSelectedIndexChange}
            isMouseIndexSelected={isMouseIndexSelected}
          />
        ) : null}
        {children}
      </div>
    );
  }
}

export default AutocompleteContainer;
