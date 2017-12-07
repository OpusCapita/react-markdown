import React from 'react';
import Types from 'prop-types';

class AdditionalButton extends React.Component {
  static propTypes = {
    onClick: Types.func,
    disabled: Types.bool,
    settings: Types.object,
  };

  static defaultProps = {
    onClick: () => {},
    disabled: false,
  };

  render() {
    const { settings, disabled, onClick } = this.props;

    return (
      <button
        className="btn btn-default"
        disabled={disabled}
        onClick={e => (settings.handleButtonPress ? onClick(settings.handleButtonPress) : null)}
      >
        {settings.iconComponent ? settings.iconComponent : ``}
        {(settings.iconComponent ? ' ' : '') + (settings.label ? settings.label : '')}
      </button>
    );
  }
}

export default AdditionalButton;
