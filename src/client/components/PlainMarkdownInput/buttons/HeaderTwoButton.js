import React from 'react';
import Types from 'prop-types';

import {
  wrapHeaderTwoMarkdown,
  hasHeaderTwoMarkdown,
  unwrapHeaderTwoMarkdown
} from '../slate/transforms';

const MarkdownHeaderTwoButton = ({ state, onChange }) => {
  const active = hasHeaderTwoMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderTwoMarkdown(state) : wrapHeaderTwoMarkdown(state))}
    >
      Header 2
    </strong>
  );
};

MarkdownHeaderTwoButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderTwoButton;
