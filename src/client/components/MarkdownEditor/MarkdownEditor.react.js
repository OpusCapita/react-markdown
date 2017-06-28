import React, { Component, PropTypes } from 'react';
import './MarkdownEditor.less';
import PlainMarkdownEditor from '../PlainMarkdownEditor';

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  autocompletes: PropTypes.array
};
const defaultProps = {
  onChange: () => {},
  value: '',
  autocompletes: []
};

export default
class MarkdownEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  onChange = (value) => {
    this.setState({
      value
    });
    this.props.onChange(value);
  };

  render() {
    return (
      <div className="markdown-editor">
        <PlainMarkdownEditor
          onChange={this.onChange}
          value={this.state.value}
          autocompletes={this.props.autocompletes}
        />
      </div>
    );
  }
}

MarkdownEditor.propTypes = propTypes;
MarkdownEditor.defaultProps = defaultProps;
