import React from 'react';
import Types from 'prop-types';
import PlainMarkdownInput from '../PlainMarkdownInput';

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
    spellCheck: Types.bool,
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
    spellCheck: false,
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
    return (
      <PlainMarkdownInput {...this.props} ref={this.plainInputRef}/>
    );
  }
}

export default MarkdownInput;
