import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderThreeMarkdown,
  hasMultiLineSelection,
  hasHeaderThreeMarkdown,
  unwrapHeaderThreeMarkdown
} from '../slate/transforms';

const MarkdownHeaderThreeButton = ({ state, onChange }) => {
  const active = hasHeaderThreeMarkdown(state);
  return (
    <strong
      onClick={e => onChange(active ? unwrapHeaderThreeMarkdown(state) : wrapHeaderThreeMarkdown(state))}
    >
      Header 3
    </strong>
  );
};

MarkdownHeaderThreeButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderThreeButton;
