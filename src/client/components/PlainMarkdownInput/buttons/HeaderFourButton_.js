import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  wrapHeaderFourMarkdown,
  hasHeaderFourMarkdown,
  unwrapHeaderFourMarkdown
} from '../slate/transforms';

const MarkdownHeaderFourButton = ({ state, onChange }) => {
  const active = hasHeaderFourMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderFourMarkdown(state) : wrapHeaderFourMarkdown(state))}
    >
      <strong>Header 4</strong>
    </MenuItem>
  );
};

MarkdownHeaderFourButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFourButton;
