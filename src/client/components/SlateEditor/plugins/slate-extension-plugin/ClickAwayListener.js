import { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const isDescendant = (el, target) => {
  if (target !== null) {
    return el === target || isDescendant(el, target.parentNode);
  }
  return false;
};

const clickAwayEvents = ['mouseup', 'touchend'];
const bind = (callback) => clickAwayEvents.forEach((event) => document.addEventListener(event, callback));
const unbind = (callback) => clickAwayEvents.forEach((event) => document.removeEventListener(event, callback));

class ClickAwayListener extends Component {
  static propTypes = {
    children: PropTypes.element,
    onClickAway: PropTypes.func
  };

  componentDidMount() {
    this.isCurrentlyMounted = true;
    if (this.props.onClickAway) {
      bind(this.handleClickAway);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onClickAway !== this.props.onClickAway) {
      unbind(this.handleClickAway);
      if (this.props.onClickAway) {
        bind(this.handleClickAway);
      }
    }
  }

  componentWillUnmount() {
    this.isCurrentlyMounted = false;
    unbind(this.handleClickAway);
  }

  handleClickAway = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    // IE11 support, which trigger the handleClickAway even after the unbind
    if (this.isCurrentlyMounted) {
      const el = ReactDOM.findDOMNode(this);

      if (document.documentElement.contains(event.target) && !isDescendant(el, event.target)) {
        this.props.onClickAway(event);
      }
    }
  };

  render() {
    return this.props.children;
  }
}

export default ClickAwayListener;
