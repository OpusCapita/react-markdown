import React from 'react';
import Types from 'prop-types';

class ObjectReferenceButton extends React.Component {
  static propTypes = {
    onClick: Types.func,
    disabled: Types.bool,
    extension: Types.object
  };

  static defaultProps = {
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
}

export default ObjectReferenceButton;
