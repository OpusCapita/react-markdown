import React from 'react';
import Types from 'prop-types';

import { wrapOrderingListMarkdown } from './MarkdownUtils';

const MarkdownOrderedListButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapOrderingListMarkdown(state))}
  >
    <i className="fa fa-list-ol"/>
  </button>
);

MarkdownOrderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownOrderedListButton;
