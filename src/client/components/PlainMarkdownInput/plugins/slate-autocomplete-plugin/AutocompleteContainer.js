import React from 'react';
import Types from 'prop-types';
import isEqual from 'lodash/isEqual';
import clickOutside from 'react-click-outside';

import AutocompleteWidget from './AutocompleteWidget';
import { getSlateEditor } from '../../utils';
import { getAccents, getPosAfterEmphasis } from '../../slate/transforms';

const escapeCode = 27;
const arrowUpCode = 38;
const arrowDownCode = 40;
const enterCode = 13;

@clickOutside
class AutocompleteContainer extends React.Component {
  static propTypes = {
    state: Types.object,
    locale: Types.string,
    options: Types.object,
    onChange: Types.func,
    onScroll: Types.func,
    onMouseUp: Types.func,
    onToggle: Types.func,
  };

  static defaultProps = {
    state: {},
    locale: 'en',
    options: {},
    onChange: () => {},
    onScroll: () => {},
    onMouseUp: () => {},
    onToggle: () => {}
  };

  state = {
    show: false,
    selectedItem: 0,
    items: [],
    ref: null
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.searchItems(this.props);
  };

  componentWillReceiveProps = (nextProps) => {
    this.searchItems(nextProps);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  matchExtension = (extensions, token) => {
    for (let i = 0, count = extensions.length; i < count; i++) {
      const extension = extensions[i];

      if (token.match(extension.termRegex)) {
        return extension;
      }
    }
    return undefined;
  };

  getSymbolPos = term => {
    let offset = [' ', '[', '('].
      map(symbol => term.lastIndexOf(symbol)).
      reduce((offset, currOffset) => (offset < currOffset ? currOffset : offset), -1);

    if (offset !== -1) {
      offset++;
    }

    return offset;
  };

  getSearchToken = state => {
    const text = state.focusBlock.text;
    const { anchorOffset } = state.selection; // FIXME: works differently for different directions of selecting.

    let term;
    let offset = -1;

    if (text && anchorOffset > 0) {
      term = text.substring(0, anchorOffset);

      if (!term.endsWith(' ')) { // FIXME: ending with TAB should behave similarly.
        offset = term.lastIndexOf(' ');
        if (offset !== -1) { offset++ }
        const accents = getAccents(state);
        if (accents.length > 0) { // this position has some accent
          let currLeftPos = getPosAfterEmphasis(state, accents);
          if (offset < currLeftPos) {
            offset = currLeftPos;
          }
        }

        if (offset !== -1) {
          term = term.substring(offset);
        }
      }
    }

    return { term, text, offset };
  };

  handleClickOutside = () => {
    if (this.state.show) {
      this.hideWidget();
    }
  }

  handleKeyDown = (e) => {
    let { show, items, selectedItem } = this.state;

    if (show && items) {
      if (e.keyCode === escapeCode) {
        e.preventDefault();
        e.stopPropagation();
        this.forceHide();
      } else if (e.keyCode === enterCode) {
        e.preventDefault();
        this.handleSelectItem(selectedItem, e);
        this.forceHide();
      } else if (e.keyCode === arrowUpCode || e.keyCode === arrowDownCode) {
        e.preventDefault();
        const length = items.length;
        selectedItem = e.keyCode === arrowDownCode ? selectedItem + 1 : selectedItem - 1;
        if (e.keyCode === arrowDownCode && selectedItem < length ||
          e.keyCode === arrowUpCode && selectedItem >= 0) {
          this.setState({ selectedItem });
        }
      }
    }
  };

  removeSpecialCharacter = (state, specialCharacter) => {
    let change = state.change();
    let text = state.startBlock.text;
    let charLength = specialCharacter.length;
    let specialCharPos = text.lastIndexOf(specialCharacter, state.endOffset);
    change.moveOffsetsTo(specialCharPos).deleteForward(charLength).
    moveOffsetsTo(state.endOffset - charLength).focus();
    this.props.onChange(change.state);
  };

  handleSelectItem = (index, event = null) => {
    console.log('iiii', index);
    const { items } = this.state;
    const { state, options } = this.props;
    const { term } = this.getSearchToken(state);

    if (term) {
      const item = items[index];

      const { extensions } = options;
      const extension = this.matchExtension(extensions, term);

      if (extension && item) {
        let change = state.change();
        change.deleteBackward(term.length).insertText(extension.markdownText(item, term)).focus();
        this.props.onChange(change.state, true);
      }

      if (!item && event) {
        this.removeSpecialCharacter(state, extension.specialCharacter);
      }
    }

    this.hideWidget();
  };

  addTerm = ({ state, options }) => {
    const { term } = this.getSearchToken(state);
    const extension = term && this.matchExtension(options.extensions, term);

    if (!extension) {
      return false;
    }

    this.setState({ items: [], loading: true });
    this.toggleWidget(true);
    const request = extension.searchItems(term).
      then(items => {
        if (this.currentRequest === request && this._isMounted) {
          this.setState({ items, selectedItem: 0, loading: false })
        }
      }).
      catch(err => {
        if (this.currentRequest === request && this._isMounted) {
          this.setState({ items: [], loading: false })
        }
      });
    this.currentRequest = request;
    return true;
  };

  toggleWidget = flag => {
    this.props.onToggle(flag);
    this.setState({ show: flag });
  };

  hideWidget = () => {
    const { show } = this.state;
    this.toggleWidget(false);
  };

  forceHide = () => {
    this.toggleWidget(false);
  };

  searchItems = props => {
    if (!this.addTerm(props)) {
      this.hideWidget();
    }
  };

  handleRef = (ref) => {
    this.setState({ ref });
  };

  getItemRenderFunc = _ => {
    const { state, options: { extensions } } = this.props;
    const { term } = this.getSearchToken(state);
    const extension = term && this.matchExtension(extensions, term);
    return (extension || {}).renderItem;
  }

  render() {
    const { show, selectedItem, items, ref, loading } = this.state;
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
      >
        {show ? (
          <AutocompleteWidget
            items={items}
            itemRenderer={this.getItemRenderFunc()}
            loading={loading}
            selectedItem={selectedItem}
            locale={locale}
            onChange={this.handleSelectItem}
            restrictorRef={ref}
          />
        ) : null}
        {children}
      </div>
    );
  }
}

export default AutocompleteContainer;
