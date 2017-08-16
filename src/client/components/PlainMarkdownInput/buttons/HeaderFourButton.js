import React from 'react';
import Types from 'prop-types';

import {
  wrapHeaderFourMarkdown,
  hasHeaderFourMarkdown,
  unwrapHeaderFourMarkdown
} from '../slate/transforms';

const MarkdownHeaderFourButton = ({ state, onChange }) => {
  const active = hasHeaderFourMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderFourMarkdown(state) : wrapHeaderFourMarkdown(state))}
    >
      Header 4
    </strong>
  );
};

MarkdownHeaderFourButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFourButton;
