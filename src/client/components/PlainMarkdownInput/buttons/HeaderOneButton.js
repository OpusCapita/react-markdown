import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  unwrapHeaderOneMarkdown,
  wrapHeaderOneMarkdown,
  hasHeaderOneMarkdown
} from '../slate/transforms';

const MarkdownHeaderOneButton = ({ state, onChange }) => {
  const active = hasHeaderOneMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderOneMarkdown(state) : wrapHeaderOneMarkdown(state))}
    >
      Header 1
    </MenuItem>
  );
};

MarkdownHeaderOneButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderOneButton;
