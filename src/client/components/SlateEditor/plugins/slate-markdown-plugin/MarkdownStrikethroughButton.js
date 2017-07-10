import React from 'react';

import {wrapStrikethroughMarkdown} from './MarkdownUtils';

const MarkdownStrikethroughButton = ({state, onChange}) => (
  <button className="btn btn-default"
          onClick={e => onChange(wrapStrikethroughMarkdown(state))}>
    <i className="fa fa-strikethrough"/>
  </button>
);

export default MarkdownStrikethroughButton;
