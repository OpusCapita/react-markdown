import React from 'react';

import { wrapHeaderFiveMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderFiveButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderFiveMarkdown(state))}
  >
    <i className="fa fa-header heading5"/>
  </button>
);

export default MarkdownHeaderFiveButton;
