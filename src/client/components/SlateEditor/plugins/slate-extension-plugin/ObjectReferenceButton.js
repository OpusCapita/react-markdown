import React from 'react';
import PropTypes from 'prop-types';
import { addObjectReference, addSpecialCharacter } from './ObjectReferenceUtils';

class ObjectReferenceButton extends React.Component {
  static propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    extension: PropTypes.object
  };

  static defaultProps = {
    state: {},
    onChange: () => {},
    disabled: false
  };

  state = {
    show: false
  };

  render() {
    const { show } = this.state;
    const { extension, disabled, onChange, state } = this.props;

    return (
      <button
        className="btn btn-default"
        disabled={disabled}
        onClick={e => onChange(addSpecialCharacter(extension.specialCharacter, state))}
      >
        {extension.objectClassName}
      </button>
    );
  }
}

export default ObjectReferenceButton;
