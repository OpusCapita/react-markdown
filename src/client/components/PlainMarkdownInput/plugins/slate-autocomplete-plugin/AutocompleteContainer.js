import React from 'react';
import Types from 'prop-types';

import AutocompleteWidget from './AutocompleteWidget';
import { getSlateEditor } from '../../utils';

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

class AutocompleteContainer extends React.Component {
  static propTypes = {
    state: Types.object,
    locale: Types.string,
    options: Types.object,
    onChange: Types.func,
    onScroll: Types.func,
  };

  static defaultProps = {
    state: {},
    locale: 'en',
    options: {},
    onChange: () => {},
    onScroll: () => {}
  };

  constructor(props) {
    console.log('constructor #');
    super(props);
    this.state = {
      show: false,
      selectedIndex: 0,
      isMouseIndexSelected: false,
      items: [],
      ref: null
    };
  }

  componentDidMount = () => {
    console.log('componentDidMount #');
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    console.log('componentWillReceiveProps #');
    console.log(`  >>> this.currEventTarget: ${this.currEventTarget}`);

    // const condition = /*!this.currEventTarget ||*/ this.currEventTarget && this.currEventTarget !== 'widget';

    // if (condition) {
      this.searchItems(nextProps);
      // if (typeof this.state.selectedIndex !== 'undefined' &&
      //   (this.props.state.startOffset === nextProps.state.startOffset) &&
      //   (this.props.state.startText.text === nextProps.state.startText.text) &&
      //   nextProps.state.startText.text) {
      //   this.handleSelectItem(this.state.selectedIndex);
      // }
    // }

    // this.currEventTarget = null;
  };

  shouldComponentUpdate = (newProps, newState) => {
    console.log('shouldComponentUpdate #');
    return this.currEventTarget && this.currEventTarget !== 'widget';
    // return this.currEventTarget && (this.currEventTarget !== 'widget' || this.currEventTarget === 'widget' && this.state.selectedIndex !== newState.selectedIndex);
  };

  matchExtension = (extensions, token) => {
    console.log('matchExtension #');
    for (let i = 0, count = extensions.length; i < count; i++) {
      const extension = extensions[i];

      if (token.match(extension.termRegex)) {
        return extension;
      }
    }
    return undefined;
  };

  getSearchToken = (state) => {
    console.log('getSearchToken #');
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
    console.log('handleSelectedIndexChange #');
    this.currEventTarget = 'item-move';
    this.setState({ isMouseIndexSelected: true, selectedIndex, show: true });
  };

  handleKeyDown = (e) => {
    const { show, items, selectedIndex } = this.state;

    if (show && items) {
      if (e.keyCode === escapeCode) {
        e.preventDefault();
        e.stopPropagation();
        this.hideWidget();
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

  handleMouseDown = e => {
    console.log('handleMouseDown #');
    this.currEventTarget = e.currTarget;

    if (this.currEventTarget === 'item') {
      this.handleSelectItem(this.state.selectedIndex);
    }
    console.log(`- `);
    console.log(`- `);
    console.log(`  >>> this.currEventTarget: ${this.currEventTarget}`);
  };

  handleSelectItem = (index) => {
    console.log('handleSelectItem #');
    console.log(`  >>> this.currEventTarget: ${this.currEventTarget}`);
    const { items } = this.state;
    const { state, options } = this.props;
    const { term } = this.getSearchToken(state);

    if (term && this.currEventTarget !== 'widget') {
      const item = items[index];

      const { extensions } = options;
      const extension = this.matchExtension(extensions, term);

      if (extension) {
        let change = state.change();
        change.deleteBackward(term.length);
        change.insertText(extension.markdownText(item) + ' ').focus();
        this.props.onChange(change.state);
      }
    }

    this.hideWidget();
  };

  addTerm = ({ state, options }) => {
    console.log('addTerm #');
    let { term } = this.getSearchToken(state);

    console.log(`term: ${term}`);

    if (term) {
      const { extensions } = options;
      const extension = this.matchExtension(extensions, term);
      if (extension) {
        this.setState({ show: true });
        extension.searchItems(term).then((items) => this.setState({ items, selectedIndex: 0 }));
        return true;
      }
    }

    return false;
  };

  hideWidget = () => {
    console.log('hideWidget #');
    const { show } = this.state;
    if (show && this.currEventTarget !== 'widget' && this.currEventTarget !== 'item-move') {
      this.setState({ show: false });
    }
  };

  searchItems = props => {
    console.log('searchItems #');
    const hasTerm = this.addTerm(props);
    if (hasTerm) {
      return;
    }

    this.hideWidget();
  };

  handleRef = (ref) => {
    this.setState({ ref });
  };

  render() {
    console.log('render #');
    const { show, selectedIndex, items, isMouseIndexSelected, ref } = this.state;
    const { children, state, locale } = this.props;

    let selection = window.getSelection();
    if (selection.anchorNode) {
      let slateEditor = getSlateEditor(selection);
      if (slateEditor && !show) {
        slateEditor.style.overflow = 'auto';
      }
    }

    return (
      <div className="AutocompleteContainer"
        onKeyDown={this.handleKeyDown}
        ref={this.handleRef}
        onMouseDown={e => {
          console.log('AutocompleteContainer.onMouseDown');
          e.currTarget = 'container';
          this.handleMouseDown(e);
          e.stopPropagation();
        }}
      >
        {show && (state.isFocused || this.currEventTarget === 'item-move') ? (
          <AutocompleteWidget
            items={items}
            selectedIndex={selectedIndex}
            locale={locale}
            onScroll={this.props.onScroll}
            onSelectItem={this.handleSelectItem}
            onSelectedIndexChange={this.handleSelectedIndexChange}
            isMouseIndexSelected={isMouseIndexSelected}
            onMouseDown={this.handleMouseDown.bind(this)}
            restrictorRef={ref}
          />
        ) : null}
        {children}
      </div>
    );
  }
}

export default AutocompleteContainer;
