import React from 'react';
import Types from 'prop-types';

import { wrapHeaderSixMarkdown } from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderSixButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapHeaderSixMarkdown(state))}
  >
    <i className="fa fa-header heading6"/>
  </button>
);

MarkdownHeaderSixButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderSixButton;
