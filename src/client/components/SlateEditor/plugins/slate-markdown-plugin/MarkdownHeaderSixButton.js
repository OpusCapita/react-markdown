import React from 'react';
import Types from 'prop-types';

import { wrapHeaderSixMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderSixButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapHeaderSixMarkdown(state))}
  >
    <i className="fa fa-header heading6"/>
  </button>
);

MarkdownHeaderSixButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderSixButton;
