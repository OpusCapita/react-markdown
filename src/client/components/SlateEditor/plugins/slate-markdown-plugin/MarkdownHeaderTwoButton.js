import React from 'react';
import Types from 'prop-types';

import { wrapHeaderTwoMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderTwoButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderTwoMarkdown(state))}
  >
    <i className="fa fa-header heading2"/>
  </button>
);

MarkdownHeaderTwoButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderTwoButton;
