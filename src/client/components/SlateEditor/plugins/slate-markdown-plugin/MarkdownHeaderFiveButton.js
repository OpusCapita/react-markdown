import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderFiveMarkdown,
  hasMultiLineSelection,
  hasHeaderFiveMarkdown,
  unwrapHeaderFiveMarkdown
} from './MarkdownUtils';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderFiveButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderFiveMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h5-tp">Header size 5</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderFiveMarkdown(state) : wrapHeaderFiveMarkdown(state))}
      >
        <i className="fa fa-header heading5"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderFiveButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderFiveButton;
