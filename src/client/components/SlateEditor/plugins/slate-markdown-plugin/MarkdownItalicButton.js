import React from 'react';
import Types from 'prop-types';

import { wrapItalicMarkdown } from './MarkdownUtils';

const MarkdownItalicButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapItalicMarkdown(state))}
  >
    <i className="fa fa-italic"/>
  </button>
);

MarkdownItalicButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownItalicButton;
