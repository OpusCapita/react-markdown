import React from 'react';
import Types from 'prop-types';
// import { addSpecialCharacter } from '../utils';
// import { ObjectReferenceUtils } from '../plugins/slate-extension-plugin';
// const { addSpecialCharacter } = ObjectReferenceUtils;

class ObjectReferenceButton extends React.Component {
  static propTypes = {
    // state: Types.object,
    // onChange: Types.func,
    onClick: Types.func,
    disabled: Types.bool,
    extension: Types.object
  };

  static defaultProps = {
    // state: {},
    // onChange: () => {},
    onClick: () => {},
    disabled: false
  };

  render() {
    const { extension, disabled, onClick } = this.props;

    return (
      <button
        className="btn btn-default"
        disabled={disabled}
        onClick={e => onClick(extension)}
      >
        {extension.objectClassName}
      </button>
    );
  }
  // render() {
  //   const { extension, disabled, onChange, state } = this.props;
  //
  //   return (
  //     <button
  //       className="btn btn-default"
  //       disabled={disabled}
  //       onClick={e => onChange(addSpecialCharacter(extension.specialCharacter, state))}
  //     >
  //       {extension.objectClassName}
  //     </button>
  //   );
  // }
}

export default ObjectReferenceButton;
