import React from 'react';
import Types from 'prop-types';
import PlainMarkdownEditor from '../PlainMarkdownEditor';

class MarkdownEditor extends React.Component {
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
    value: this.props.value,
    fullScreen: false
  };

  handleChangeValue = (value) => {
    this.props.onChange(value);

    this.setState({ value });
  };

  handleFullScreen = (fullScreen) => {
    this.setState({ fullScreen });
  };

  render() {
    const { value, fullScreen } = this.state;
    const { extensions } = this.props;

    return (
      <PlainMarkdownEditor
        value={value}
        onChange={this.handleChangeValue}
        onFullScreen={this.handleFullScreen}
        fullScreen={fullScreen}
        extensions={extensions}
      />
    );

  }
}

export default MarkdownEditor;
