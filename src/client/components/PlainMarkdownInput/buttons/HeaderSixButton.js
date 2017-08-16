import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  wrapHeaderSixMarkdown,
  hasHeaderSixMarkdown,
  unwrapHeaderSixMarkdown
} from '../slate/transforms';

const MarkdownHeaderSixButton = ({ state, onChange }) => {
  const active = hasHeaderSixMarkdown(state);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeaderSixMarkdown(state) : wrapHeaderSixMarkdown(state))}
    >
      Header 6
    </MenuItem>
  );
};

MarkdownHeaderSixButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderSixButton;
