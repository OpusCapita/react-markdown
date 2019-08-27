import React from 'react';
import Types from 'prop-types';
import PlainMarkdownInput from '../PlainMarkdownInput';

class MarkdownInputModal extends React.Component {
  static propTypes = {
    value: Types.string,
    onChange: Types.func,
    onFullScreen: Types.func,
    extensions: Types.array,
    additionalButtons: Types.array,
    readOnly: Types.bool,
    showFullScreenButton: Types.bool,
    spellCheck: Types.bool,
    locale: Types.string
  };

  static defaultProps = {
    value: '',
    onChange: () => {},
    onFullScreen: () => {},
    extensions: [],
    additionalButtons: [],
    readOnly: false,
    showFullScreenButton: false,
    spellCheck: false,
    locale: 'en'
  };

  handleChangeValue = (value) => {
    this.props.onChange(value);
  };

  handleFullScreen = (fullScreen) => {
    this.props.onFullScreen(fullScreen);
  };

  render() {
    const { value, extensions, additionalButtons, readOnly, showFullScreenButton, spellCheck, locale } = this.props;

    return (
      <PlainMarkdownInput
        ref={ref => ref && (this.focus = ref.focus.bind(ref))}
        value={value}
        onChange={this.handleChangeValue}
        onFullScreen={this.handleFullScreen}
        extensions={extensions}
        additionalButtons={additionalButtons}
        readOnly={readOnly}
        showFullScreenButton={showFullScreenButton}
        spellCheck={spellCheck}
        locale={locale}
      />
    );
  }
}

export default MarkdownInputModal;
