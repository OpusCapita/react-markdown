import React from 'react';
import Types from 'prop-types';

import { wrapHeaderFourMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderFourButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderFourMarkdown(state))}
  >
    <i className="fa fa-header heading4"/>
  </button>
);

MarkdownHeaderFourButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFourButton;
