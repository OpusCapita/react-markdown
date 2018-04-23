import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';
import { getSlateEditor } from '../../utils';
import getMessage from '../../../translations';
import DefaultAutocompleteItem from './DefaultAutocompleteItem.react';

const maxHeight = 240;

export default class AutocompleteWidget extends React.Component {
  static propTypes = {
    isMouseIndexSelected: Types.bool,
    onSelectedIndexChange: Types.func,
    items: Types.array,
    locale: Types.string,
    onMouseDown: Types.func,
    onMouseUp: Types.func,
    onScroll: Types.func,
    onSelectItem: Types.func,
    selectedIndex: Types.number,
    style: Types.object,
    restrictorRef: Types.object,
    renderItem: Types.func,
    loading: Types.bool
  }

  static defaultProps = {
    isMouseIndexSelected: false,
    onSelectedIndexChange: () => {},
    items: [],
    locale: 'en',
    onMouseDown: () => {},
    onMouseUp: () => {},
    onScroll: () => {},
    onSelectItem: () => {},
    style: {},
    restrictorRef: null
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
    this['items-ref'].addEventListener('scroll', this.props.onScroll, false);
  };

  componentWillReceiveProps = (nextProps) => {
    this.cancelAdjustPosition();
    this.adjustPosition();
  };

  componentWillUpdate = (nextProps) => {
    let { isMouseIndexSelected } = this.props;
    let itemsRef = this['items-ref'];
    let itemRef = this[`item-ref-${nextProps.selectedIndex}`];

    if (itemsRef && itemRef && !isMouseIndexSelected) { // calculating scrolling with keyboard up and down arrows
      if ((this.props.selectedIndex < nextProps.selectedIndex) && (itemRef.offsetTop - itemsRef.scrollTop > 156)) {
        itemsRef.scrollTop = (itemRef.offsetTop - 156);
      }
      if ((this.props.selectedIndex > nextProps.selectedIndex) && (itemRef.offsetTop - itemsRef.scrollTop < 26)) {
        itemsRef.scrollTop = (itemRef.offsetTop - 26);
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

  handleSelectItem = index => {
    this.props.onSelectItem(index);
  };

  setPosition = (selection) => {
    let editorWidth = this.props.restrictorRef.offsetWidth;
    let autocompleteWidth = this['items-ref'].offsetWidth;
    let autocompleteHeight = this['items-ref'].offsetHeight;
    let selectionRect = selection.getRangeAt(0).getBoundingClientRect(); // element with cursor
    let restrictorRect = this.props.restrictorRef.getBoundingClientRect();
    let lineHeight = selectionRect.bottom - selectionRect.top;

    let left = selectionRect.left - restrictorRect.left;
    left = editorWidth >= left + autocompleteWidth ? left : left - autocompleteWidth;
    left = left < 0 ? 0 : left;

    let top = selectionRect.top - restrictorRect.top + lineHeight + 4;
    let offsetTop = selection.anchorNode.parentNode.offsetTop;
    let slateEditor = getSlateEditor(selection);

    slateEditor.style.overflow = 'hidden';

    let showToTop = slateEditor.scrollTop + slateEditor.offsetHeight < offsetTop + autocompleteHeight;
    if (showToTop) {
      top -= autocompleteHeight + lineHeight;
      top = top < 0 ? 0 : top;
    }
    let position = {
      left: `${left}px`,
      top: `${top}px`
    };

    let positionChanged = (this.state.left !== position.left) || (this.state.top !== position.top);

    if (positionChanged) {
      this.setState(position);
    }

    this._animationFrame = window.requestAnimationFrame(() => this.adjustPosition());
  };

  adjustPosition = () => {
    let selection = window.getSelection();

    if (selection.anchorNode) {
      this.setPosition(selection);
    }
  };

  saveRef = ref => (this['items-ref'] = ref);

  handleMouseDown = e => {
    e.preventDefault(); // XXX Not work in IE11
    e.stopPropagation(); // Isolate event target
    this.props.onMouseDown('widget');
  }

  handleMouseUp = e => {
    e.stopPropagation(); // Isolate event target
    this.props.onMouseUp();
  }

  handleItemMouseDown = e => {
    e.stopPropagation(); // Isolate event target
    this.props.onMouseDown('item');
  }

  render() {
    const { left, top, transform } = this.state;
    const { items, locale, selectedIndex, onSelectedIndexChange, renderItem: CustomRender, loading } = this.props;

    const ItemComponent = CustomRender ? CustomRender : DefaultAutocompleteItem;

    const commonProps = {
      className: "react-markdown--autocomplete-widget",
      ref: this.saveRef,
      style: {
        left,
        top,
        transform,
        maxHeight: `${maxHeight}px`,
        ...this.props.style
      }
    }

    if (loading) {
      return (
        <div {...commonProps}>
          <div className="react-markdown--autocomplete-widget__item">
            <span>Searching</span>
            <i className="fa fa-spinner fa-spin pull-right" style={{ marginTop: '3px' }}></i>
          </div>
        </div>
      )
    }

    if (items) {
      return (
        <div
          {...commonProps}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >
          {items.map((item, index) => {
            return (
              <div
                key={index}
                ref={ref => (this[`item-ref-${index}`] = ref)}
                onClick={_ => this.handleSelectItem(index)}
                onMouseMove={_ => onSelectedIndexChange(index)}
                onMouseDown={this.handleItemMouseDown}
              >
                <ItemComponent
                  item={item}
                  isSelected={selectedIndex === index}
                />
              </div>
            );
          })}

          {items.length === 0 && !loading && (
            <div className="react-markdown--autocomplete-widget__item">{getMessage(locale, 'noMatchesFound')}</div>
          )}
        </div>
      );
    }

    return null;
  }
}

