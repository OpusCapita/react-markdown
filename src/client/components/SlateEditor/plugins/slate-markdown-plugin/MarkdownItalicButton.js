import React from 'react';

import { wrapItalicMarkdown } from './MarkdownUtils';

const MarkdownItalicButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapItalicMarkdown(state))}
  >
    <i className="fa fa-italic"/>
  </button>
);

export default MarkdownItalicButton;
