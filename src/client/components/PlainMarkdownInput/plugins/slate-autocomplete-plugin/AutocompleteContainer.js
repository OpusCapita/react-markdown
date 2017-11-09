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
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.searchItems(nextProps);
  };

  /**
   * update a component in all cases, except pressing on a scroll of a widget
   * XXX FOR IE11. Issue #78@opuscapita/react-markdown
   *
   * @returns {boolean}
   */
  shouldComponentUpdate = (newProps, newState) => {
    return !!this.currEventTarget && this.currEventTarget !== 'widget';
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

  /**
   * handleSelectedIndexChange
   * @param {number} selectedIndex
   */
  handleSelectedIndexChange = (selectedIndex) => {
    // This value is necessary in order that the mouseMove event has been processed and the component was rerendered
    this.currEventTarget = 'item-move';
    this.setState({ isMouseIndexSelected: true, selectedIndex });
  };

  handleKeyDown = (e) => {
    let { show, items, selectedIndex } = this.state;

    if (show && items) {
      if (e.keyCode === escapeCode) {
        e.preventDefault();
        e.stopPropagation();
        this.forceHide();
      } else if (e.keyCode === enterCode) {
        e.preventDefault();
        this.handleSelectItem(selectedIndex);
        this.forceHide();
      } else if (e.keyCode === arrowUpCode || e.keyCode === arrowDownCode) {
        e.preventDefault();
        const length = items.length;
        selectedIndex = e.keyCode === arrowDownCode ? selectedIndex + 1 : selectedIndex - 1;
        if (e.keyCode === arrowDownCode && selectedIndex < length ||
          e.keyCode === arrowUpCode && selectedIndex >= 0) {
          this.setState({ isMouseIndexSelected: false, selectedIndex });
        }
      }
    }
  };

  /**
   * handleMouseDown
   *
   *  Is called for a container, for a widget and for an item
   *  Get and save the event's target
   *  If there was a click on item, call handleSelectItem for one
   * @param {string} currTarget
   */
  handleMouseDown = currTarget => {
    this.currEventTarget = currTarget;
    if (this.currEventTarget === 'item') {
      this.handleSelectItem(this.state.selectedIndex);
    }
  };

  handleSelectItem = (index) => {
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
    let { term } = this.getSearchToken(state);

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

  /**
   * hideWidget
   */
  hideWidget = () => {
    const { show } = this.state;
    // Check of the event's target is necessary for IE11
    // XXX FOR IE11. Issue #78@opuscapita/react-markdown
    if (show && this.currEventTarget !== 'widget' && this.currEventTarget !== 'item-move') {
      this.setState({ show: false });
    }
  };

  forceHide = () => {
    this.setState({ show: false });
  };

  searchItems = props => {
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
          this.handleMouseDown('container');
          e.stopPropagation(); // Isolate event target
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
