import React from 'react';
import PropTypes from 'prop-types';
import ObjectReferenceEditor from './ObjectReferenceEditor';
import { addObjectReference, addSpecialCharacter } from './ObjectReferenceUtils';

class ObjectReferenceButton extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func,
    mode: PropTypes.string,
    disabled: PropTypes.bool,
    extension: PropTypes.object
  };

  static defaultProps = {
    state: {},
    onChange: () => {},
    mode: 'rich',
    disabled: false
  };

  state = {
    show: false
  };

  handleRichEditorChange = (text) => {
    let { onChange, state, extension } = this.props;
    onChange(addObjectReference(text, extension, state));
    this.setState({ show: false });
  };

  handleObjectReferenceEditorOpen = () => {
    this.setState({ show: true })
  };

  render() {
    const { show } = this.state;
    const { mode, extension, disabled, onChange, state } = this.props;

    if (mode === 'plain') {
      return (
        <button className="btn btn-default" disabled={disabled}
          onClick={e => onChange(addSpecialCharacter(extension.specialCharacter, state))}
        >
          {extension.objectClassName}
        </button>
      )
    } else { // 'rich' mode
      return (
        <button className="btn btn-default" disabled={disabled}
          onClick={this.handleObjectReferenceEditorOpen}
        >
          {show ? (
            <ObjectReferenceEditor extension={this.props.extension}
              onChange={this.handleRichEditorChange}
              onCancel={() => { this.setState({ show: false }) }}
              mode="insert"
            />
          ) : null }
          {extension.objectClassName}
        </button>
      )
    }
  }
}

export default ObjectReferenceButton;
