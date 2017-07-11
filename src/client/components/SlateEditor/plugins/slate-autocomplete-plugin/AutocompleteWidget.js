import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';

const getSelectionTopLeft = function() {
  const selection = window.getSelection();
  let rangePos, left = 0, top = 0;
  if (selection.rangeCount) {
    rangePos = window.getSelection().getRangeAt(0).getBoundingClientRect();
    // you can get also right and bottom here if you like
    left = parseInt(rangePos.left, 10) + 5;
    top = parseInt(rangePos.top, 10) + window.scrollY;
  }
  return { left, top };
};

class AutocompleteWidget extends React.Component {
  state = {
    left: 0,
    top: 0
  };

  componentDidMount = () => {
    this.setState(getSelectionTopLeft());
  };

  componentWillReceiveProps = (nextProps) => {
    // get selection bounding client rect on next cycle
    setTimeout(() => {
      this.setState(getSelectionTopLeft());
    });
  };

  componentWillUpdate = (nextProps, nextState) => {
    let list = this.refs.autocompleteList;
    let targetLi = this.refs[`autocompleteItem${nextProps.selectedIndex}`];

    if (list && targetLi) {
      if ((this.props.selectedIndex < nextProps.selectedIndex) && (targetLi.offsetTop - list.scrollTop > 156)) {
        list.scrollTop = (targetLi.offsetTop - 156);
      }
      if ((this.props.selectedIndex > nextProps.selectedIndex) && (targetLi.offsetTop - list.scrollTop < 26)) {
        list.scrollTop = (targetLi.offsetTop - 26);
      }
    }
  };

  handleSelectItem = (index, e) => {
    e.preventDefault();
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top } = this.state;
    const { items, selectedIndex } = this.props;

    const styles = {
      zIndex: 99999,
      display: 'block',
      left,
      top
    };

    if (items !== undefined && items !== null) {
      return (
        <ul className="dropdown-menu textcomplete-dropdown"
          ref="autocompleteList"
          style={styles}
        >
          {items.map((item, index) => {
            return (
              <li key={index}
                ref={`autocompleteItem${index}`}
                onClick={this.handleSelectItem.bind(this, index)}
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

AutocompleteWidget.propTypes = {
  items: Types.array,
  onSelectItem: Types.func,
  selectedIndex: Types.number,
};

export default AutocompleteWidget;
