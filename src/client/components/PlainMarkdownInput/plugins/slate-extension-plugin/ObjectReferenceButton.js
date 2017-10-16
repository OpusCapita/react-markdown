import React from 'react';
import Types from 'prop-types';
import { addSpecialCharacter } from './ObjectReferenceUtils';

class ObjectReferenceButton extends React.Component {
  static propTypes = {
    state: Types.object,
    onChange: Types.func,
    disabled: Types.bool,
    extension: Types.object
  };

  static defaultProps = {
    state: {},
    onChange: () => {},
    disabled: false
  };

  render() {
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
