import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  wrapHeaderTwoMarkdown,
  hasHeaderTwoMarkdown,
  unwrapHeaderTwoMarkdown
} from '../slate/transforms';

const MarkdownHeaderTwoButton = ({ state, onChange }) => {
  const active = hasHeaderTwoMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderTwoMarkdown(state) : wrapHeaderTwoMarkdown(state))}
    >
      <strong>Header 2</strong>
    </MenuItem>
  );
};

MarkdownHeaderTwoButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderTwoButton;
