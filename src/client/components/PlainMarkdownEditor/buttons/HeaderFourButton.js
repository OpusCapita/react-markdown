import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderFourMarkdown,
  hasMultiLineSelection,
  hasHeaderFourMarkdown,
  unwrapHeaderFourMarkdown
} from '../slate/transforms';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderFourButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderFourMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h4-tp">Header size 4</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderFourMarkdown(state) : wrapHeaderFourMarkdown(state))}
      >
        <i className="fa fa-header heading4"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderFourButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFourButton;
