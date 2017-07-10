import React from 'react';
import Types from 'prop-types';

import { wrapUnorderedListMarkdown } from './MarkdownUtils';

const MarkdownUnorderedListButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapUnorderedListMarkdown(state))}
  >
    <i className="fa fa-list-ul"/>
  </button>
);

MarkdownUnorderedListButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownUnorderedListButton;
