import React from 'react';
import Types from 'prop-types';
import getMessage from '../../translations';

const LinkButton = ({ onClick, disabled, locale }) => (
  <button
    className="btn btn-default"
    disabled={disabled}
    onClick={e => onClick()}
    type="button"
    title={getMessage(locale, 'insertLink')}
  >
    <i className="fa fa-link"/>
  </button>
);

LinkButton.propTypes = {
  disabled: Types.bool,
  onClick: Types.func,
  locale: Types.string
};

LinkButton.defaultProps = {
  active: false,
  disabled: false,
  locale: 'en'
};

export default LinkButton;
