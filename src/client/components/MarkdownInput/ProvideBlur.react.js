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
    this.selfDOMNode = findDOMNode(this);
    this.selfDOMNode.addEventListener('focusin', this.handleFocusIn);
    this.selfDOMNode.addEventListener('focusout', this.handleFocusOut);
  }

  componentWillUnmount() {
    this.selfDOMNode.removeEventListener('focusin', this.handleFocusIn)
    this.selfDOMNode.removeEventListener('focusout', this.handleFocusOut)
  }

  handleFocusIn = _ => {
    if (!this.state.isFocused) {
      this.setState(
        { isFocused: true },
        (_ => this.props.onFocus())
      );
    }
  };

  handleFocusOut = _ => {
    const data = { timeout: null };
    const abortFocusOut = _ => clearTimeout(data.timeout);

    data.timeout = setTimeout(_ => {
      this.selfDOMNode.removeEventListener('focusin', abortFocusOut);
      this.setState({ isFocused: false }, this.props.onBlur);
    })

    this.selfDOMNode.addEventListener('focusin', abortFocusOut)
  }

  render() {
    const { children } = this.props;
    return children instanceof Function ? children() : children;
  }
}
