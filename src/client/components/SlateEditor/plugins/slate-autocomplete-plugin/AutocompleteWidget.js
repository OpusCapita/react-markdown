import React from 'react';
import './Autocomplete.less';
import PropTypes from 'prop-types';

class AutocompleteWidget extends React.Component {
  static propTypes = {
    isMouseIndexSelected: PropTypes.bool,
    onSelectedIndexChange: PropTypes.func,
    items: PropTypes.array,
    onSelectItem: PropTypes.func,
    selectedIndex: PropTypes.number,
    styles: PropTypes.object
  };

  state = {
    left: null,
    top: null
  };

  componentDidMount = () => {
    this.setState(this.getSelectionTopLeft());
  };

  componentWillReceiveProps = (nextProps) => {
    // get selection bounding client rect on next cycle
    setTimeout(() => {
      this.setState(this.getSelectionTopLeft());
    });
  };

  componentWillUpdate = (nextProps, nextState) => {
    let { isMouseIndexSelected } = this.props;
    let list = this.refs['items-list'];
    let targetLi = this.refs[`item-${nextProps.selectedIndex}`];

    if (list && targetLi && !isMouseIndexSelected) {  // calculating scrolling with keyboard up and down arrows
      if ((this.props.selectedIndex < nextProps.selectedIndex) && (targetLi.offsetTop - list.scrollTop > 156)) {
        list.scrollTop = (targetLi.offsetTop - 156);
      }
      if ((this.props.selectedIndex > nextProps.selectedIndex) && (targetLi.offsetTop - list.scrollTop < 26)) {
        list.scrollTop = (targetLi.offsetTop - 26);
      }
    }
  };

  getSelectionTopLeft = () => {
    const selection = window.getSelection();
    let rangePos, left = 0, top = 0;
    if (selection.rangeCount) {
      rangePos = window.getSelection().getRangeAt(0).getBoundingClientRect();

      if(!rangePos.top && !rangePos.bottom) {
        // XXX preserve autocomplete blinking on first render
        return ({ left: null, top: null });
      }

      // you can get also right and bottom here if you like
      left = parseInt(rangePos.left, 10) + 5;
      top = parseInt(rangePos.top, 10) + window.scrollY;
    }
    let list = this.refs['items-list'];
    // recalculating items-list left offset if sidebar present
    if (list && (list.getBoundingClientRect().left - list.offsetLeft < left)) {
      left = left - (list.getBoundingClientRect().left - list.offsetLeft);
    }
    return { left, top };
  };

  handleSelectItem = (index, e) => {
    e.preventDefault();
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top } = this.state;
    const { items, selectedIndex, onSelectedIndexChange } = this.props;

    const styles = {
      zIndex: 99999,
      display: (top === null || left === null) ? 'none' : 'block',
      left,
      top,
      ...this.props.styles
    };

    if (items !== undefined && items !== null) {
      return (
        <ul className="react-markdown--autocomplete-widget dropdown-menu textcomplete-dropdown"
          ref="items-list"
          style={styles}
        >
          {items.map((item, index) => {
            return (
              <li key={index}
                ref={`item-${index}`}
                onClick={this.handleSelectItem.bind(this, index)}
                onMouseMove={onSelectedIndexChange.bind(this, index)}
                className={'textcomplete-item' + (selectedIndex === index ? ' active' : '')}
              >
                <a href={void(0)}>{item._objectLabel}</a>
              </li>
            );
          })}

          {items.length === 0 ? (
            <li className="textcomplete-no-results-message">No matches found</li>
          ) : null}
        </ul>
      );
    } else {
      return null;
    }
  }
}

export default AutocompleteWidget;
