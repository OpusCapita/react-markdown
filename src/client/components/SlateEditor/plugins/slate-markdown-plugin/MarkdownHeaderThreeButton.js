import React from 'react';

import {wrapHeaderThreeMarkdown} from './MarkdownUtils';

import './HeaderStyles.css';

const MarkdownHeaderThreeButton = ({state, onChange}) => (
  <button className="btn btn-default"
          onClick={e => onChange(wrapHeaderThreeMarkdown(state))}>
    <i className="fa fa-header heading3"/>
  </button>
);

export default MarkdownHeaderThreeButton;
