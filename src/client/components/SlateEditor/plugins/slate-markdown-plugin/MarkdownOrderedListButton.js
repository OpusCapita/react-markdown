import React from 'react';

import { wrapOrderingListMarkdown } from './MarkdownUtils';

const MarkdownOrderedListButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapOrderingListMarkdown(state))}
  >
    <i className="fa fa-list-ol"/>
  </button>
);

export default MarkdownOrderedListButton;
