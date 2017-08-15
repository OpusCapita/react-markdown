import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderSixMarkdown,
  hasMultiLineSelection,
  hasHeaderSixMarkdown,
  unwrapHeaderSixMarkdown
} from '../slate/transforms';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderSixButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderSixMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h6-tp">Header size 6</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderSixMarkdown(state) : wrapHeaderSixMarkdown(state))}
      >
        <i className="fa fa-header heading6"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderSixButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderSixButton;
