import React from 'react';

import {wrapBlockQuoteMarkdown} from './MarkdownUtils';

const MarkdownBlockQuoteButton = ({state, onChange}) => (
  <button className="btn btn-default"
          onClick={e => onChange(wrapBlockQuoteMarkdown(state))}>
    <i className="fa fa-quote-right"/>
  </button>
);

export default MarkdownBlockQuoteButton;
