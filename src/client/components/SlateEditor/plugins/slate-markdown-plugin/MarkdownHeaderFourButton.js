import React from 'react';

import { wrapHeaderFourMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderFourButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderFourMarkdown(state))}
  >
    <i className="fa fa-header heading4"/>
  </button>
);

export default MarkdownHeaderFourButton;
