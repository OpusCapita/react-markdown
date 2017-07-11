import React from 'react';
import Types from 'prop-types';

import { wrapHeaderFourMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderFourButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapHeaderFourMarkdown(state))}
  >
    <i className="fa fa-header heading4"/>
  </button>
);

MarkdownHeaderFourButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFourButton;
