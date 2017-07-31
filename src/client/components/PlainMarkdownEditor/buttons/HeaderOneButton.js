import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  unwrapHeaderOneMarkdown,
  wrapHeaderOneMarkdown,
  hasMultiLineSelection,
  hasHeaderOneMarkdown
} from '../slate/transforms';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderOneButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderOneMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h1-tp">Header size 1</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderOneMarkdown(state) : wrapHeaderOneMarkdown(state))}
      >
        <i className="fa fa-header heading1"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderOneButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderOneButton;
