import React from 'react';
import Types from 'prop-types';
import getMessage from '../../translations';

import { wrapLinkMarkdown, hasMultiLineSelection } from '../slate/transforms';

const MarkdownLinkButton = ({ state, onChange, disabled, locale }) => (
  <button
    className="btn btn-default"
    disabled={disabled || hasMultiLineSelection(state)}
    onClick={e => onChange(wrapLinkMarkdown(state))}
    type="button"
    title={getMessage(locale, 'insertLink')}
  >
    <i className="fa fa-link"/>
  </button>
);

MarkdownLinkButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownLinkButton.defaultProps = {
  locale: 'en'
};

export default MarkdownLinkButton;
