import React from 'react';
import Types from 'prop-types';
import getMessage from '../../translations';

const MarkdownLinkButton = ({ onClick, disabled, locale }) => (
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

MarkdownLinkButton.propTypes = {
  disabled: Types.bool,
  onClick: Types.func,
  locale: Types.string
};

MarkdownLinkButton.defaultProps = {
  locale: 'en'
};

export default MarkdownLinkButton;
