import React from 'react';
import Types from 'prop-types';

import { wrapLinkMarkdown, hasMultiLineSelection } from '../slate/transforms';

const MarkdownLinkButton = ({ state, onChange, disabled }) => (
  <button
    className="btn btn-default"
    disabled={disabled || hasMultiLineSelection(state)}
    onClick={e => onChange(wrapLinkMarkdown(state))}
    type="button"
    title="Insert link"
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
