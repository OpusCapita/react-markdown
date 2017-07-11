import React from 'react';
import Types from 'prop-types';

import AutocompleteWidget from './AutocompleteWidget';
// polyfile Promise for IE
import 'bluebird';

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

const propTypes = {
  state: Types.object,
  editor: Types.object,
  options: Types.object
};

const defaultProps = {
  state: {},
  editor: {},
  options: {}
};

class AutocompleteContainer extends React.Component {
  state = {
    show: false,
    selectedIndex: 0,
    isLoading: false,
    isMouseIndexSelected: false
  };

  componentDidMount = () => {
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.searchItems(nextProps);
    if (this.state.items &&
      (this.props.state.startOffset === nextProps.state.startOffset) &&
      (this.props.state.startText.text === nextProps.state.startText.text) &&
      nextProps.state.startText.text) {
      this.handleSelectItem(this.state.selectedIndex);
    } else {
      this.setState({show: false})
    }
  };

  matchRule = (rules, token) => {
    for (let i = 0, count = rules.length; i < count; i++) {
      const rule = rules[i];

      if (token.match(rule.termRegex)) {
        return rule;
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
      this.setState({selectedIndex});
    } else {
      this.setState({isMouseIndexSelected: true});
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

        this.setState({isMouseIndexSelected: false});
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

      const { rules } = options;
      const rule = this.matchRule(rules, term);

      if (rule) {
        let t = state.transform();
        t.deleteBackward(term.length);
        t.insertText(rule.selectItem(item) + ' ');

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
      const { rules } = options;
      const rule = this.matchRule(rules, term);

      const { show } = this.state;
      if (rule) {
        this.setState({ show: true, isLoading: true });
        rule.fetch(term).then((items) => this.setState({ items, selectedIndex: 0, isLoading: false }));
      } else if (show) {
        this.setState({ show: false })
      }
    }
  };

  render() {
    const { show, selectedIndex, items, isLoading } = this.state;
    const { children, state } = this.props;

    return (
      <div onKeyDown={this.handleKeyDown}>
        {show && state.isFocused ? (
          <AutocompleteWidget items={items}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelectItem={this.handleSelectItem}
            onSelectedIndexChange={this.handleSelectedIndexChange}
            isMouseIndexSelected={this.state.isMouseIndexSelected}
          />
        ) : null}
        {children}
      </div>
    );
  }
}

AutocompleteContainer.propTypes = propTypes;
AutocompleteContainer.defaultProps = defaultProps;

export default AutocompleteContainer;
