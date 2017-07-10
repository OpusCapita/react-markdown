import React from 'react';

import { wrapInlineCodeMarkdown } from './MarkdownUtils';

const MarkdownInlineCodeButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapInlineCodeMarkdown(state))}
  >
    <i className="fa fa-code"/>
  </button>
);

export default MarkdownInlineCodeButton;
