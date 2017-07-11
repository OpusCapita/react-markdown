import React from 'react';
import Types from 'prop-types';

import { wrapHeaderThreeMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderThreeButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapHeaderThreeMarkdown(state))}
  >
    <i className="fa fa-header heading3"/>
  </button>
);

MarkdownHeaderThreeButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderThreeButton;
