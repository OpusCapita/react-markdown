import React from 'react';
import Types from 'prop-types';
import PlainMarkdownInput from '../PlainMarkdownInput';
import ProvideBlur from './ProvideBlur.react';

class MarkdownInput extends React.Component {
  static propTypes = {
    value: Types.string,
    onChange: Types.func,
    onBlur: Types.func,
    onFullScreen: Types.func,
    extensions: Types.array,
    additionalButtons: Types.array,
    readOnly: Types.bool,
    autoFocus: Types.bool,
    showFullScreenButton: Types.bool,
    locale: Types.string,
    hideToolbar: Types.bool
  };

  static defaultProps = {
    value: '',
    onChange: () => {},
    onBlur: () => {},
    onFullScreen: () => {},
    extensions: [],
    additionalButtons: [],
    readOnly: false,
    autoFocus: true,
    showFullScreenButton: false,
    locale: 'en',
    hideToolbar: false
  };

  plainInputRef = el => (this.plainInput = el);

  // make this function a part of public API
  insertAtCursorPosition = text => {
    if (this.plainInput) {
      this.plainInput.insertAtCursorPosition(text);
    }
  }

  render() {
    const { onBlur, ...props } = this.props;

    return (
      <ProvideBlur onBlur={onBlur}>
        <PlainMarkdownInput {...props} ref={this.plainInputRef}/>
      </ProvideBlur>
    );
  }
}

export default MarkdownInput;
