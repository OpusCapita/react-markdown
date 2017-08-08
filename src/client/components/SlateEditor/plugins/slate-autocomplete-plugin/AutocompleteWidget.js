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

class AutocompleteWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0
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
    let left = 0;
    let top = 0;

    let position = {
      left: `${selectionRect.left - restrictorRect.left}px`,
      top: `${selectionRect.top - restrictorRect.top + lineHeight + 4}px`
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
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top } = this.state;
    const { items, selectedIndex, onSelectedIndexChange, restrictorRef } = this.props;

    if (items) {
      return (
        <div
          className="react-markdown--autocomplete-widget"
          style={{
            left,
            top,
            ...this.props.style
          }}
        >
          {items.map((item, index) => {
            return (
              <div
                key={index}
                onClick={this.handleSelectItem.bind(this, index)}
                onMouseMove={onSelectedIndexChange.bind(this, index)}
                className={`
                  react-markdown--autocomplete-widget__item
                  ${selectedIndex === index ? 'react-markdown--autocomplete-widget__item--active' : ''}
                `}
              >
                <div href={void(0)}>{item._objectLabel}</div>
              </div>
            );
          })}

          {items.length ? (
            <li className="textcomplete-no-results-message">No matches found</li>
          ) : null}
        </div>
      );
    }

    return null;
  }
}

export default AutocompleteWidget;
