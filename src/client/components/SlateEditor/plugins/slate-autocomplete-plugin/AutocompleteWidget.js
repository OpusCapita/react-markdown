import React from 'react';
import './Autocomplete.less';
import Types from 'prop-types';

class AutocompleteWidget extends React.Component {
  state = {
    left: 0,
    top: 0
  };

  componentDidMount = () => {
    this.setState(this.getPosition());
  };

  componentWillReceiveProps = (nextProps) => {
    // get selection bounding client rect on next cycle
    setTimeout(() => {
      this.setState(this.getPosition());
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

  getPosition = () => {
    const selection = window.getSelection();

    let left = 0, top = 0;

    if (selection.anchorNode) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      top = rect.top - rect.height + window.pageYOffset;
      left = rect.left + window.pageXOffset;
    }

    return { left, top };
  };

  handleSelectItem = (index, e) => {
    e.preventDefault();
    this.props.onSelectItem(index);
  };

  render() {
    const { left, top } = this.state;
    const { items, selectedIndex } = this.props;

    const styles = {
      position: 'absolute',
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
