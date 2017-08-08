import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';

const propTypes = {
  isMouseIndexSelected: Types.bool,
  onSelectedIndexChange: Types.func,
  items: Types.array,
  onSelectItem: Types.func,
  selectedIndex: Types.number,
  style: Types.object,
  restrictorRef: Types.object
};

const defaultProps = {
  isMouseIndexSelected: false,
  onSelectedIndexChange: () => {},
  items: [],
  onSelectItem: () => {},
  style: {},
  restrictorRef: null
};

const maxHeight = 240;

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
  }

  adjustPosition = () => {
    let selection = window.getSelection();

    if (!selection.anchorNode) {
      return;
    }

    let selectionRect = selection.getRangeAt(0).getBoundingClientRect();
    let restrictorRect = this.props.restrictorRef.getBoundingClientRect();
    let lineHeight = selectionRect.bottom - selectionRect.top;
    let left = selectionRect.left - restrictorRect.left;
    let top = selectionRect.top - restrictorRect.top + lineHeight + 4;

    let showToTop = (top + maxHeight) > restrictorRect.bottom;

    let position = {
      left: `${left}px`,
      top: `${showToTop ? top - lineHeight : top}px`,
      transform: `${showToTop ? 'translateY(-100%)' : ''}`
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
  }

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
            return (
              <div
                key={index}
                ref={ref => (this[`item-ref-${index}`] = ref)}
                onClick={() => this.handleSelectItem(index)}
                onMouseMove={() => onSelectedIndexChange(index)}
                className={`
                  react-markdown--autocomplete-widget__item
                  ${selectedIndex === index ? 'react-markdown--autocomplete-widget__item--active' : ''}
                `}
              >
                {item._objectLabel}
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
