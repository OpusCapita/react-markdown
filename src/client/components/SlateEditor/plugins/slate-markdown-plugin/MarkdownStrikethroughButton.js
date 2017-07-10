import React from 'react';
import Types from 'prop-types';

import { wrapStrikethroughMarkdown } from './MarkdownUtils';

const MarkdownStrikethroughButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapStrikethroughMarkdown(state))}
  >
    <i className="fa fa-strikethrough"/>
  </button>
);

MarkdownStrikethroughButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownStrikethroughButton;
