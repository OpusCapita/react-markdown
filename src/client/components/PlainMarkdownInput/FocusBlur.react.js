import { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * This setup is needed to create proper `blur` handler.
 * Slate-react Editor has `onBlur` prop, but if we just supply it to Editor component,
 * `blur` will fire when a user clicks buttons B, I etc. But we need `blur` to fire only when
 * component loses focus, and not when we operate with internal elements of editor.
 */
export default class ProvideBlur extends PureComponent {
  static propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static defaultProps = {
    onBlur: () => {},
    onFocus: () => {}
  }

  state = {
    isFocused: false
  }

  componentDidMount() {
    this.el = findDOMNode(this);
    this.el.addEventListener('focusin', this.handleFocusIn);
    this.el.addEventListener('focusout', this.handleFocusOut);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevFocused = prevState.isFocused;
    const { isFocused } = this.state;

    if (isFocused && prevFocused !== isFocused) {
      this.props.onFocus()
    }

    if (!isFocused && prevFocused !== isFocused) {
      this.props.onBlur()
    }
  }

  componentWillUnmount() {
    this.el.removeEventListener('focusin', this.handleFocusIn)
    this.el.removeEventListener('focusout', this.handleFocusOut)
  }

  handleFocusIn = event => {
    if (!this.state.isFocused) {
      this.setState({ isFocused: true });
    }
  };

  timeout = null;

  handleFocusOut = event => {
    const abortFocusOut = _ => {
      clearTimeout(this.timeout);
    }
    this.el.addEventListener('focusin', abortFocusOut);

    this.timeout = setTimeout(_ => {
      this.el.removeEventListener('focusin', abortFocusOut);
      this.setState({ isFocused: false });
    });
  }

  render() {
    const { children } = this.props;
    return children instanceof Function ? children() : children;
  }
}
