import React from 'react';
import Types from 'prop-types';

import { wrapBoldMarkdown } from './MarkdownUtils';

const MarkdownBoldButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapBoldMarkdown(state))}
  >
    <i className="fa fa-bold"/>
  </button>
);

MarkdownBoldButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBoldButton;
