import React from 'react';
import Types from 'prop-types';

import { wrapHeaderOneMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderOneButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapHeaderOneMarkdown(state))}
  >
    <i className="fa fa-header heading1"/>
  </button>
);

MarkdownHeaderOneButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderOneButton;
