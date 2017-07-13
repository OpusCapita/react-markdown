import React from 'react';
import Types from 'prop-types';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import { wrapLinkMarkdown, hasMultiLineSelection } from './MarkdownUtils';

const MarkdownLinkButton = ({ state, onChange, disabled }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="link-tp">Insert link</Tooltip>}>
    <button className="btn btn-default" disabled={disabled || hasMultiLineSelection(state)}
            onClick={e => onChange(wrapLinkMarkdown(state))}
    >
      <i className="fa fa-link"/>
    </button>
  </OverlayTrigger>
);

MarkdownLinkButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownLinkButton;
