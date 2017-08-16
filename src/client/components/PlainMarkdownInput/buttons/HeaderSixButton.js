import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderSixMarkdown,
  hasMultiLineSelection,
  hasHeaderSixMarkdown,
  unwrapHeaderSixMarkdown
} from '../slate/transforms';

const MarkdownHeaderSixButton = ({ state, onChange }) => {
  const active = hasHeaderSixMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderSixMarkdown(state) : wrapHeaderSixMarkdown(state))}
    >
      Header 6
    </strong>
  );
};

MarkdownHeaderSixButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderSixButton;
