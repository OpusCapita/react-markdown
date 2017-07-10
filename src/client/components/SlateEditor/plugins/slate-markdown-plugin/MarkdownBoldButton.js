import React from 'react';

import { wrapBoldMarkdown } from './MarkdownUtils';

const MarkdownBoldButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapBoldMarkdown(state))}
  >
    <i className="fa fa-bold"/>
  </button>
);

export default MarkdownBoldButton;
