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

  render() {
    const {
      value,
      extensions,
      additionalButtons,
      readOnly,
      showFullScreenButton,
      locale,
      autoFocus,
      hideToolbar
    } = this.props;

    return (
      <PlainMarkdownInput
        value={value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFullScreen={this.props.onFullScreen}
        extensions={extensions}
        additionalButtons={additionalButtons}
        readOnly={readOnly}
        showFullScreenButton={showFullScreenButton}
        locale={locale}
        autoFocus={autoFocus}
        hideToolbar={hideToolbar}
      />
    );
  }
}

export default MarkdownInput;
