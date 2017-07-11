import React from 'react';
import Types from 'prop-types';

import { wrapBlockQuoteMarkdown } from './MarkdownUtils';

const MarkdownBlockQuoteButton = ({ state, onChange, disabled }) => (
  <button className="btn btn-default" disabled={disabled}
    onClick={e => onChange(wrapBlockQuoteMarkdown(state))}
  >
    <i className="fa fa-quote-right"/>
  </button>
);

MarkdownBlockQuoteButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBlockQuoteButton;
