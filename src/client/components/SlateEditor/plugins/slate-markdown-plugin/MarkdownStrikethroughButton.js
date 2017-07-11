import React from 'react';
import Types from 'prop-types';

import { wrapStrikethroughMarkdown } from './MarkdownUtils';

const MarkdownStrikethroughButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapStrikethroughMarkdown(state))}
  >
    <i className="fa fa-strikethrough"/>
  </button>
);

MarkdownStrikethroughButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownStrikethroughButton;
