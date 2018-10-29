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
    // IE11 & firefox trigger focusout when you click on PlainMarkdownInput.
    // In order to eliminate it we can stop listening for focusout when focusin occurs.
    this.el.removeEventListener('focusout', this.handleFocusOut);
    setTimeout(_ => this.el && this.el.addEventListener('focusout', this.handleFocusOut));
    return this.setState(prevState => prevState.isFocused ? {} : { isFocused: true })
  };

  timeout = null;

  abortFocusOut = _ => {
    clearTimeout(this.timeout);
  }

  handleFocusOut = event => {
    this.el.addEventListener('focusin', this.abortFocusOut);
    this.timeout = setTimeout(_ => {
      if (this.el) {
        this.el.removeEventListener('focusin', this.abortFocusOut);
      }
      this.setState({ isFocused: false });
    });
  }

  render() {
    const { children } = this.props;
    return children instanceof Function ? children() : children;
  }
}
