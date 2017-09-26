import React from 'react';
import Types from 'prop-types';
import PlainMarkdownInput from '../PlainMarkdownInput';

class MarkdownInput extends React.Component {
  static propTypes = {
    value: Types.string,
    onChange: Types.func,
    extensions: Types.array
  };

  static defaultProps = {
    value: '',
    onChange: () => {},
    extensions: []
  };

  state = {
    fullScreen: false
  };

  handleChangeValue = (value) => {
    this.props.onChange(value);
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  render() {
    const { fullScreen } = this.state;
    const { value, extensions } = this.props;

    return (
      <PlainMarkdownInput
        value={value}
        onChange={this.handleChangeValue}
        onFullScreen={this.handleFullScreen}
        fullScreen={fullScreen}
        extensions={extensions}
      />
    );
  }
}

export default MarkdownInput;
