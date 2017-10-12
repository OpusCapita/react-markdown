import React from 'react';
import Types from 'prop-types';
import PlainMarkdownInput from '../PlainMarkdownInput';

class MarkdownInput extends React.Component {
  static propTypes = {
    value: Types.string,
    onChange: Types.func,
    onFullScreen: Types.func,
    extensions: Types.array,
    readOnly: Types.bool,
    locale: Types.string
  };

  static defaultProps = {
    value: '',
    onChange: () => {},
    onFullScreen: () => {},
    extensions: [],
    readOnly: false,
    locale: 'en-GB'
  };

  handleChangeValue = (value) => {
    this.props.onChange(value);
  };

  handleFullScreen = (fullScreen) => {
    this.props.onFullScreen(fullScreen);
  };

  render() {
    const { value, extensions, readOnly, locale } = this.props;

    return (
      <PlainMarkdownInput
        value={value}
        onChange={this.handleChangeValue}
        onFullScreen={this.handleFullScreen}
        extensions={extensions}
        readOnly={readOnly}
        locale={locale}
      />
    );
  }
}

export default MarkdownInput;
