import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  wrapHeaderFiveMarkdown,
  hasHeaderFiveMarkdown,
  unwrapHeaderFiveMarkdown
} from '../slate/transforms';

const MarkdownHeaderFiveButton = ({ state, onChange }) => {
  const active = hasHeaderFiveMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderFiveMarkdown(state) : wrapHeaderFiveMarkdown(state))}
    >
      <strong>Header 5</strong>
    </MenuItem>
  );
};

MarkdownHeaderFiveButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFiveButton;
