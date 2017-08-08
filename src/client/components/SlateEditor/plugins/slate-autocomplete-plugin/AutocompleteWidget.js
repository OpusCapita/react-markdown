import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';

const propTypes = {
  isMouseIndexSelected: Types.bool,
  onSelectedIndexChange: Types.func,
  items: Types.array,
  onSelectItem: Types.func,
  selectedIndex: Types.number,
  styles: Types.object,
  restrictorRef: Types.object
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

  componentWillUnmount = () => {
    this.cancelAdjustPosition();
  }

  adjustPosition = () => {
    let selection = window.getSelection();
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

    let positionChanged = (this.state.left !== position.left ) || (this.state.top !== position.top);

    if(positionChanged) {
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
    console.log('click!', index);
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top, transform } = this.state;
    const { items, selectedIndex, onSelectedIndexChange, restrictorRef } = this.props;

    if (items) {
      return (
        <div
          className="react-markdown--autocomplete-widget"
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
                onClick={() => console.log('click!') || this.handleSelectItem(index)}
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

export default AutocompleteWidget;
