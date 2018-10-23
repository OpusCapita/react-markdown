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

  componentWillUpdate = (nextProps) => {
    const containerRef = this.containerRef;
    const itemRef = this[`itemRef${nextProps.selectedItem}`];
    if (containerRef && itemRef) { // calculating scrolling with keyboard up and down arrows
      if ((this.props.selectedItem < nextProps.selectedItem) && (itemRef.offsetTop - containerRef.scrollTop > 156)) {
        containerRef.scrollTop = (itemRef.offsetTop - 156);
      }
      if ((this.props.selectedItem > nextProps.selectedItem) && (itemRef.offsetTop - containerRef.scrollTop < 26)) {
        containerRef.scrollTop = (itemRef.offsetTop - 26);
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
    const editorWidth = this.props.restrictorRef.offsetWidth;
    const autocompleteWidth = this['containerRef'].offsetWidth;
    const autocompleteHeight = this['containerRef'].offsetHeight;
    const selectionRect = selectedItem.getRangeAt(0).getBoundingClientRect(); // element with cursor
    const restrictorRect = this.props.restrictorRef.getBoundingClientRect();
    const lineHeight = selectionRect.bottom - selectionRect.top;

    let left = selectionRect.left - restrictorRect.left + this.props.restrictorRef.offsetLeft;
    left = editorWidth >= left + autocompleteWidth ? left : left - autocompleteWidth;
    left = left < 0 ? 0 : left;

    let top = selectionRect.top - restrictorRect.top + lineHeight + 4;
    const offsetTop = selectedItem.anchorNode.parentNode.offsetTop;
    const slateEditor = getSlateEditor(selectedItem);

    slateEditor.style.overflow = 'hidden';

    const showToTop = slateEditor.scrollTop + slateEditor.offsetHeight < offsetTop + autocompleteHeight;
    if (showToTop) {
      top -= autocompleteHeight + lineHeight;
      top = top < 0 ? 0 : top;
    }
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

  render() {
    const { left, top, transform } = this.state;
    const {
      items,
      locale,
      selectedItem,
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

    const notFoundElement = items.length === 0 && !loading ? (
      <div className="react-markdown--autocomplete-widget__item">{getMessage(locale, 'noMatchesFound')}</div>
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
