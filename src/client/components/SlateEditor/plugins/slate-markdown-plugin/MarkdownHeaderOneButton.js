import React from 'react';

import { wrapHeaderOneMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderOneButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderOneMarkdown(state))}
  >
    <i className="fa fa-header heading1"/>
  </button>
);

export default MarkdownHeaderOneButton;
