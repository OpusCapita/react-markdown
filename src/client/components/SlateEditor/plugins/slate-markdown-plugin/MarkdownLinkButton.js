import React from 'react';

import {wrapLinkMarkdown} from './MarkdownUtils';

const MarkdownLinkButton = ({state, onChange}) => (
  <button className="btn btn-default"
          onClick={e => onChange(wrapLinkMarkdown(state))}>
    <i className="fa fa-link"/>
  </button>
);

export default MarkdownLinkButton;
