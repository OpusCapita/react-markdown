import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  wrapHeaderThreeMarkdown,
  hasHeaderThreeMarkdown,
  unwrapHeaderThreeMarkdown
} from '../slate/transforms';

const MarkdownHeaderThreeButton = ({ state, onChange }) => {
  const active = hasHeaderThreeMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderThreeMarkdown(state) : wrapHeaderThreeMarkdown(state))}
    >
      Header 3
    </MenuItem>
  );
};

MarkdownHeaderThreeButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderThreeButton;
