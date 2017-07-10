import React from 'react';
import Types from 'prop-types';

import { wrapBlockQuoteMarkdown } from './MarkdownUtils';

const MarkdownBlockQuoteButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapBlockQuoteMarkdown(state))}
  >
    <i className="fa fa-quote-right"/>
  </button>
);

MarkdownBlockQuoteButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBlockQuoteButton;
