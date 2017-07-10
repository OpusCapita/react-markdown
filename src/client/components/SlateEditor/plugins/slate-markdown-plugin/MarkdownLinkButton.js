import React from 'react';
import Types from 'prop-types';

import { wrapLinkMarkdown } from './MarkdownUtils';

const MarkdownLinkButton = ({ state, onChange }) => (
  <button className="btn btn-default"
    onClick={e => onChange(wrapLinkMarkdown(state))}
  >
    <i className="fa fa-link"/>
  </button>
);

MarkdownLinkButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default MarkdownLinkButton;
