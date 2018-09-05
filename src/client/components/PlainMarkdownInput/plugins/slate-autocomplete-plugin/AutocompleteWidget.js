import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';
import { getSlateEditor } from '../../utils';
import getMessage from '../../../translations';
import DefaultAutocompleteItem from './DefaultAutocompleteItem.react';

const maxHeight = 240;

export default class AutocompleteWidget extends React.Component {
  static propTypes = {
    items: Types.array,
    loading: Types.bool,
    locale: Types.string,
    onChange: Types.func,
    itemRenderer: Types.func,
    restrictorRef: Types.object,
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

  componentWillUnmount = () => {
    this.cancelAdjustPosition();
  };

  componentWillUpdate = (nextProps) => {
    let containerRef = this.containerRef;
    let itemRef = this[`itemRef${nextProps.selectedItem}`];
    if (containerRef && itemRef) { // calculating scrolling with keyboard up and down arrows
      if ((this.props.selectedItem < nextProps.selectedItem) && (itemRef.offsetTop - containerRef.scrollTop > 156)) {
        containerRef.scrollTop = (itemRef.offsetTop - 156);
      }
      if ((this.props.selectedItem > nextProps.selectedItem) && (itemRef.offsetTop - containerRef.scrollTop < 26)) {
        containerRef.scrollTop = (itemRef.offsetTop - 26);
      }
    }
  };

  cancelAdjustPosition = () => {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame); // XXX
    }
  };

  setPosition = (selectedItem) => {
    let editorWidth = this.props.restrictorRef.offsetWidth;
    let autocompleteWidth = this['containerRef'].offsetWidth;
    let autocompleteHeight = this['containerRef'].offsetHeight;
    let selectionRect = selectedItem.getRangeAt(0).getBoundingClientRect(); // element with cursor
    let restrictorRect = this.props.restrictorRef.getBoundingClientRect();
    let lineHeight = selectionRect.bottom - selectionRect.top;

    let left = selectionRect.left - restrictorRect.left;
    left = editorWidth >= left + autocompleteWidth ? left : left - autocompleteWidth;
    left = left < 0 ? 0 : left;

    let top = selectionRect.top - restrictorRect.top + lineHeight + 4;
    let offsetTop = selectedItem.anchorNode.parentNode.offsetTop;
    let slateEditor = getSlateEditor(selectedItem);

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
    let selectedItem = window.getSelection();

    if (selectedItem.anchorNode) {
      this.setPosition(selectedItem);
    }
  };

  handleItemMouseDown = (index) => {
    console.log('click');
    this.props.onChange(index);
  }

  render() {
    const { left, top, transform } = this.state;
    const {
      items,
      locale,
      selectedItem,
      onChange,
      itemRenderer,
      loading
    } = this.props;

    if (loading) {
      return (
        <div
          ref={ref => (this.containerRef = ref)}
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
            <span>{getMessage(locale, 'searching')}</span>
            <i className="fa fa-spinner fa-spin pull-right" style={{ marginTop: '3px' }}></i>
          </div>
        </div>
      );
    }

    let notFoundElement = items.length === 0 && !loading ? (
      <div className="react-markdown--autocomplete-widget__item">{getMessage(locale, 'noMatchesFound')}</div>
    ) : null;

    let itemsElement = items.map((item, index) => {
      const selected = selectedItem === index;
      return (
        <div
          key={index}
          ref={ref => (this[`itemRef${index}`] = ref)}
          onMouseDown={_ => this.handleItemMouseDown(index)}
        >
          <input type="radio" style={{ display: 'none' }} selected={selected} />
          {itemRenderer({ item, selected })}
        </div>
      );
    });

    if (items) {
      return (
        <div
          ref={ref => (this.containerRef = ref)}
          style={{
            left,
            top,
            transform,
            maxHeight: `${maxHeight}px`,
            ...this.props.style
          }}
          className="react-markdown--autocomplete-widget"
       >
          <fieldset>
            {itemsElement}
          </fieldset>
          {notFoundElement}
        </div>
      );
    }

    return null;
  }
}
