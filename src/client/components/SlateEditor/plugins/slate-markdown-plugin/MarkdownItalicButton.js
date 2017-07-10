import React from 'react';
import Types from 'prop-types';

import { wrapItalicMarkdown } from './MarkdownUtils';

const MarkdownItalicButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapItalicMarkdown(state))}
  >
    <i className="fa fa-italic"/>
  </button>
);

MarkdownItalicButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownItalicButton;
