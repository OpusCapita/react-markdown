import React, { Component, PropTypes } from 'react';
import './MarkdownEditor.less';

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
};
const defaultProps = {
  onChange: () => {},
  value: ''
};

export default
class MarkdownEditor extends Component {
  render() {
    const {
      onChange,
      value
    } = this.props;

    return (
      <div className="markdown-editor">
        {value}
      </div>
    );
  }
}

MarkdownEditor.propTypes = propTypes;
MarkdownEditor.defaultProps = defaultProps;
