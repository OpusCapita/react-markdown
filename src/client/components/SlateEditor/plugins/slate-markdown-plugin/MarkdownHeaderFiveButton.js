import React from 'react';
import Types from 'prop-types';

import { wrapHeaderFiveMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderFiveButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderFiveMarkdown(state))}
  >
    <i className="fa fa-header heading5"/>
  </button>
);

MarkdownHeaderFiveButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFiveButton;
