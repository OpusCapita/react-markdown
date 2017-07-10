import React from 'react';
import Types from 'prop-types';

import { wrapInlineCodeMarkdown } from './MarkdownUtils';

const MarkdownInlineCodeButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapInlineCodeMarkdown(state))}
  >
    <i className="fa fa-code"/>
  </button>
);

MarkdownInlineCodeButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownInlineCodeButton;
