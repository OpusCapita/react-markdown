import React, { Component, PropTypes } from 'react';

const propTypes = {
  items: PropTypes.array,
  left: PropTypes.number,
  top: PropTypes.number,
  selectedIndex: PropTypes.number,
  onItemClick: PropTypes.func,
  onItemMouseMove: PropTypes.func
};
const defaultProps = {
  items: [],
  left: 0,
  top: 0,
  selectedIndex: 0,
  onItemClick: () => {},
  onItemMouseMove: () => {}
};

export default
class AutocompleteItemsList extends Component {
  render() {
    let { left, top } = this.props;
    const listStyle = Object.assign({}, styles.list, {
      position: 'fixed',
      left,
      top
    });
    if (this.props.items.length) {
      return (
        <ul style={listStyle}>
          {this.props.items.map((item, index) => {
            return (
              <li key={index}
                  style={index === this.props.selectedIndex ? styles.selectedValue : styles.value}
                  onClick={this.props.onItemClick.bind(this, index)}
                  onMouseMove={this.props.onItemMouseMove.bind(this, index)}
              >
                {item._objectLabel}
              </li>
            );
          })}
        </ul>
      )
    } else {
      return (
        <ul style={listStyle}>
          <li style={styles.value}>
            No matches found.
          </li>
        </ul>
      )
    }
  }
}

AutocompleteItemsList.propTypes = propTypes;
AutocompleteItemsList.defaultProps = defaultProps;

const styles = {
  list: {
    margin: 0,
    padding: 0,
    border: '1px solid #ccc',
    background: 'white',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .1), 0 1px 10px rgba(0, 0, 0, .35)',
    borderRadius: 3,
    listStyleType: 'none',
    zIndex: 100000
  },
  value: {
    margin: 0,
    padding: '16px 24px'
  },
  selectedValue: {
    margin: 0,
    padding: '16px 24px',
    background: 'DarkOrchid',
    color: 'white'
  }
};
