import React from 'react';

import { wrapUnorderedListMarkdown } from './MarkdownUtils';

const MarkdownUnorderedListButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapUnorderedListMarkdown(state))}
  >
    <i className="fa fa-list-ul"/>
  </button>
);

export default MarkdownUnorderedListButton;
