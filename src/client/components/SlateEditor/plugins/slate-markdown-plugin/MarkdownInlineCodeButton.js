import React from 'react';
import Types from 'prop-types';

import { wrapInlineCodeMarkdown } from './MarkdownUtils';

const MarkdownInlineCodeButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapInlineCodeMarkdown(state))}
  >
    <i className="fa fa-code"/>
  </button>
);

MarkdownInlineCodeButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownInlineCodeButton;
