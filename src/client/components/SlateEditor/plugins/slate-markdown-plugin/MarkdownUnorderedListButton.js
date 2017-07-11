import React from 'react';
import Types from 'prop-types';

import { wrapUnorderedListMarkdown } from './MarkdownUtils';

const MarkdownUnorderedListButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapUnorderedListMarkdown(state))}
  >
    <i className="fa fa-list-ul"/>
  </button>
);

MarkdownUnorderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownUnorderedListButton;
