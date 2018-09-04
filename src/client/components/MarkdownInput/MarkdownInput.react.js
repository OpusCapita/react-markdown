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

  handleChangeValue = (value) => {
    this.props.onChange(value);
  };

  handleFullScreen = (fullScreen) => {
    this.props.onFullScreen(fullScreen);
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
      <ProvideBlur onBlur={this.props.onBlur}>
        <PlainMarkdownInput
          ref={el => (this.selfDOMNode = el)}
          value={value}
          onChange={this.handleChangeValue}
          onFullScreen={this.handleFullScreen}
          extensions={extensions}
          additionalButtons={additionalButtons}
          readOnly={readOnly}
          showFullScreenButton={showFullScreenButton}
          locale={locale}
          autoFocus={autoFocus}
          hideToolbar={hideToolbar}
        />
      </ProvideBlur>
    );
  }
}

export default MarkdownInput;
