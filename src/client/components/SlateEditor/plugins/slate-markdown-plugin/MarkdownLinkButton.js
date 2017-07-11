import React from 'react';
import Types from 'prop-types';

import { wrapLinkMarkdown } from './MarkdownUtils';

const MarkdownLinkButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapLinkMarkdown(state))}
  >
    <i className="fa fa-link"/>
  </button>
);

MarkdownLinkButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownLinkButton;
