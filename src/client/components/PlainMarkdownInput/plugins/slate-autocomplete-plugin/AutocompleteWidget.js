import React, { PureComponent } from 'react';
import './Autocomplete.less';
import Types from 'prop-types';
import { getSlateEditor } from '../../utils';
import getMessage from '../../../translations';
import DefaultAutocompleteItem from './DefaultAutocompleteItem.react';

const maxHeight = 240;

export default class AutocompleteWidget extends PureComponent {
  static propTypes = {
    items: Types.array,
    loading: Types.bool,
    locale: Types.string,
    onChange: Types.func,
    itemRenderer: Types.func,
    restrictorRef: Types.object,
    containerRef: Types.object,
    selectedItem: Types.number,
    style: Types.object
  }

  static defaultProps = {
    items: [],
    loading: false,
    locale: 'en',
    onChange: () => {},
    itemRenderer: DefaultAutocompleteItem,
    restrictorRef: null,
    selectedItem: null,
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      transform: ''
    };
  }

  componentDidMount = () => {
    this.adjustPosition();
  };

  componentWillReceiveProps = (nextProps) => {
    this.cancelAdjustPosition();
    this.adjustPosition();
  };

  componentWillUpdate = (nextProps) => {
    const { widgetRef } = this;
    const itemRef = this[`itemRef${nextProps.selectedItem}`];
    if (widgetRef && itemRef) { // calculating scrolling with keyboard up and down arrows
      if ((this.props.selectedItem < nextProps.selectedItem) && (itemRef.offsetTop - widgetRef.scrollTop > 156)) {
        widgetRef.scrollTop = (itemRef.offsetTop - 156);
      }
      if ((this.props.selectedItem > nextProps.selectedItem) && (itemRef.offsetTop - widgetRef.scrollTop < 26)) {
        widgetRef.scrollTop = (itemRef.offsetTop - 26);
      }
    }
  };

  componentWillUnmount = () => {
    this.cancelAdjustPosition();
  };

  cancelAdjustPosition = () => {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame); // XXX
    }
  };

  setPosition = (selectedItem) => {
    const { restrictorRef, containerRef } = this.props;

    const editorWidth = restrictorRef.offsetWidth;
    const autocompleteWidth = this.widgetRef.offsetWidth;
    const selectionRect = selectedItem.getRangeAt(0).getBoundingClientRect(); // element with cursor
    const restrictorRect = restrictorRef.getBoundingClientRect();
    const containerRect = containerRef.getBoundingClientRect();

    let left = selectionRect.left - restrictorRect.left + restrictorRef.offsetLeft;
    left = editorWidth >= left + autocompleteWidth ? left : left - autocompleteWidth;
    left = left < 0 ? 0 : left;

    const top = selectionRect.bottom - containerRect.top;

    const slateEditor = getSlateEditor(selectedItem);

    slateEditor.style.overflow = 'hidden';

    const position = {
      left: `${left}px`,
      top: `${top}px`
    };

    const positionChanged = (this.state.left !== position.left) || (this.state.top !== position.top);

    if (positionChanged) {
      this.setState(position);
    }

    this._animationFrame = window.requestAnimationFrame(this.adjustPosition);
  };

  adjustPosition = () => {
    const { restrictorRef } = this.props;
    const selectedItem = window.getSelection();
    // If user clicks outside of autocomplete then selectedItem won't be in a subtree of editor.
    // We don't perform any editor-specific actions in this case.
    if (selectedItem.anchorNode && restrictorRef && (
      restrictorRef.contains(selectedItem.anchorNode) ||
      // Fix for IE11: Node.contains() in IE11 works only with Element nodes, not with Text nodes
      // (other browsers work with both). For IE11 we walk up the tree to find a proper element.
      restrictorRef.contains(selectedItem.anchorNode.parentNode)
    )) {
      this.setPosition(selectedItem);
    }
  };

  handleItemMouseDown = (index) => {
    this.props.onChange(index);
  }

  saveWidgetRef = el => (this.widgetRef = el);

  render() {
    const { left, top, transform } = this.state;
    const { items, locale, selectedItem, itemRenderer, loading } = this.props;

    if (loading) {
      return (
        <div
          ref={this.saveWidgetRef}
          style={{
            left,
            top,
            transform,
            maxHeight: `${maxHeight}px`,
            ...this.props.style
          }}
          className="react-markdown--autocomplete-widget"
        >
          <div className="react-markdown--autocomplete-widget__item">
            <span>{getMessage(locale, 'common.PlainMarkdownInput.searching')}</span>
            <i className="fa fa-spinner fa-spin pull-right" style={{ marginTop: '3px' }}></i>
          </div>
        </div>
      );
    }

    const notFoundElement = items.length === 0 && !loading ? (
      <div className="react-markdown--autocomplete-widget__item">
        {getMessage(locale, 'common.PlainMarkdownInput.noMatchesFound')}
      </div>
    ) : null;

    const itemsElement = items.map((item, index) => {
      const isSelected = selectedItem === index;
      return (
        <div
          key={index}
          ref={ref => (this[`itemRef${index}`] = ref)}
          onMouseDown={_ => this.handleItemMouseDown(index)}
        >
          <input type="radio" style={{ display: 'none' }} selected={isSelected} />
          {itemRenderer({ item, isSelected })}
        </div>
      );
    });

    if (items) {
      return (
        <div
          ref={this.saveWidgetRef}
          style={{
            left,
            top,
            transform,
            maxHeight: `${maxHeight}px`,
            ...this.props.style
          }}
          className="react-markdown--autocomplete-widget"
          onMouseDown={e => {
            // prevent 'blur' event on 'input' while clicking inside widget
            // e.g. click on suggestion or scroll bar
            // acknowledged in https://github.com/OpusCapita/react-markdown/issues/167
            e.preventDefault()
          }}
        >
          {
            notFoundElement ?
              notFoundElement :
              (
                <div className="react-markdown--autocomplete-widget__items">
                  {itemsElement}
                </div>
              )
          }
        </div>
      );
    }

    return null;
  }
}
