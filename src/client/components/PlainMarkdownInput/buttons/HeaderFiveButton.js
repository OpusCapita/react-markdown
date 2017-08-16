import React from 'react';
import Types from 'prop-types';

import {
  wrapHeaderFiveMarkdown,
  hasHeaderFiveMarkdown,
  unwrapHeaderFiveMarkdown
} from '../slate/transforms';

const MarkdownHeaderFiveButton = ({ state, onChange }) => {
  const active = hasHeaderFiveMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderFiveMarkdown(state) : wrapHeaderFiveMarkdown(state))}
    >
      Header 5
    </strong>
  );
};

MarkdownHeaderFiveButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFiveButton;
