import React from 'react';

import AutocompleteWidget from './AutocompleteWidget';

//polyfile Promise for IE
import 'bluebird';

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

class AutocompleteContainer extends React.Component {
  state = {
    show: false,
    selectedIndex: 0,
    isLoading: false
  };

  matchRule = (rules, token) => {
    for (let i = 0, count = rules.length; i < count; i++) {
      const rule = rules[i];

      if (token.match(rule.termRegex)) {
        return rule;
      }
    }
  };

  getSearchToken = (state) => {
    const text = state.focusBlock.text;
    const {anchorOffset} = state.selection;

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

    return {term, text, offset};
  };

  handleKeyDown = (e) => {
    const {show, items, selectedIndex} = this.state;

    if (show && items) {
      if (e.keyCode === escapeCode) {
        e.preventDefault();

        this.setState({show: false});
      } else if (e.keyCode === enterCode) {
        e.preventDefault();

        this.handleSelectItem(selectedIndex);
      } else if (e.keyCode === arrowUpCode || e.keyCode === arrowDownCode) {
        e.preventDefault();

        const length = items.length;
        if (e.keyCode === arrowDownCode && selectedIndex < length - 1) {
          this.setState({selectedIndex: selectedIndex + 1});
        } else if (e.keyCode === arrowUpCode && selectedIndex > 0) {
          this.setState({selectedIndex: selectedIndex - 1});
        }
      }
    }
  };

  handleSelectItem = (index) => {
    const {items} = this.state;
    const {state, editor, options} = this.props;

    const {term} = this.getSearchToken(state);

    if (term) {
      const item = items[index];

      const {rules} = options;
      const rule = this.matchRule(rules, term);

      if (rule) {
        let t = state.transform();
        t.deleteBackward(term.length);
        t.insertText(rule.selectItem(item) + ' ');

        editor.onChange(
          t.focus()
            .apply()
        );
      }
    }

    this.setState({show: false});
  };

  searchItems = ({state, options}) => {
    let {term} = this.getSearchToken(state);

    if (term) {
      const {rules} = options;
      const rule = this.matchRule(rules, term);

      const {show} = this.state;
      if (rule) {
        this.setState({show: true, isLoading: true});
        rule.fetch(term).then((items) => this.setState({items, selectedIndex: 0, isLoading: false}));
      } else if (show) {
        this.setState({show: false})
      }
    }
  };

  componentDidMount = () => {
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.searchItems(nextProps);
  };

  render() {
    const {show, selectedIndex, items, isLoading} = this.state;
    const {children} = this.props;

    return (
      <div onKeyDown={this.handleKeyDown}>
        {children}
        {show ? (
          <AutocompleteWidget items={items}
                              isLoading={isLoading}
                              selectedIndex={selectedIndex}
                              onSelectItem={this.handleSelectItem}/>
        ) : null}
      </div>
    );
  }
}

export default AutocompleteContainer;