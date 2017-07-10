import React from 'react';
import Types from 'prop-types';

import { wrapBoldMarkdown } from './MarkdownUtils';

const MarkdownBoldButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapBoldMarkdown(state))}
  >
    <i className="fa fa-bold"/>
  </button>
);

MarkdownBoldButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBoldButton;
