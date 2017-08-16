import React from 'react';
import Types from 'prop-types';

import {
  unwrapHeaderOneMarkdown,
  wrapHeaderOneMarkdown,
  hasHeaderOneMarkdown
} from '../slate/transforms';

const MarkdownHeaderOneButton = ({ state, onChange }) => {
  const active = hasHeaderOneMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderOneMarkdown(state) : wrapHeaderOneMarkdown(state))}
    >
      Header 1
    </strong>
  );
};

MarkdownHeaderOneButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderOneButton;
