import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';
import { getSlateEditor } from '../../../PlainMarkdownInput/Utils';

const propTypes = {
  isMouseIndexSelected: Types.bool,
  onSelectedIndexChange: Types.func,
  items: Types.array,
  onMouseDown: Types.func,
  onScroll: Types.func,
  onSelectItem: Types.func,
  selectedIndex: Types.number,
  style: Types.object,
  restrictorRef: Types.object
};

const defaultProps = {
  isMouseIndexSelected: false,
  onSelectedIndexChange: () => {},
  items: [],
  onScroll: () => {},
  onSelectItem: () => {},
  style: {},
  restrictorRef: null
};

const maxHeight = 240;
const maxItemLength = 15;

class AutocompleteWidget extends React.Component {
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

  componentWillUpdate = (nextProps, nextState) => {
    let { isMouseIndexSelected } = this.props;
    let itemsRef = this['items-ref'];
    let itemRef = this[`item-ref-${nextProps.selectedIndex}`];

    if (itemsRef && itemRef && !isMouseIndexSelected) {  // calculating scrolling with keyboard up and down arrows
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

  adjustPosition = () => {
    let selection = window.getSelection();

    if (!selection.anchorNode) {
      return;
    }

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

  cancelAdjustPosition = () => {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
  };

  handleSelectItem = (index, e) => {
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top, transform } = this.state;
    const { items, selectedIndex, onSelectedIndexChange } = this.props;

    if (items) {
      return (
        <div
          className="react-markdown--autocomplete-widget"
          ref={ref => (this['items-ref'] = ref)}
          style={{
            left,
            top,
            transform,
            maxHeight: `${maxHeight}px`,
            ...this.props.style
          }}
        >
          {items.map((item, index) => {
            const itemLabel = item._objectLabel;
            const itemLength = itemLabel.length;
            return (
              <div
                key={index}
                ref={ref => (this[`item-ref-${index}`] = ref)}
                onClick={() => this.handleSelectItem(index)}
                onMouseDown={this.props.onMouseDown}
                onMouseMove={() => onSelectedIndexChange(index)}
                className={`
                  react-markdown--autocomplete-widget__item
                  ${selectedIndex === index ? 'react-markdown--autocomplete-widget__item--active' : ''}
                `}
                title={itemLength > maxItemLength ? itemLabel : ''}
              >
                {itemLength > maxItemLength ? `${itemLabel.substr(0, maxItemLength)}…` : itemLabel}
              </div>
            );
          })}

          {!items.length ? (
            <div className="react-markdown--autocomplete-widget__item">No matches found</div>
          ) : null}
        </div>
      );
    }

    return null;
  }
}

AutocompleteWidget.propTypes = propTypes;
AutocompleteWidget.defaultProps = defaultProps;

export default AutocompleteWidget;
