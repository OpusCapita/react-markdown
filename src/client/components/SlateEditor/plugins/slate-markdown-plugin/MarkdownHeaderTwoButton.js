import React from 'react';
import Types from 'prop-types';

import { wrapHeaderTwoMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderTwoButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapHeaderTwoMarkdown(state))}
  >
    <i className="fa fa-header heading2"/>
  </button>
);

MarkdownHeaderTwoButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderTwoButton;
