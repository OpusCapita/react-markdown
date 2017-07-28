import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderThreeMarkdown,
  hasMultiLineSelection,
  hasHeaderThreeMarkdown,
  unwrapHeaderThreeMarkdown
} from '../slate/transforms';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderThreeButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderThreeMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h3-tp">Header size 3</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderThreeMarkdown(state) : wrapHeaderThreeMarkdown(state))}
      >
        <i className="fa fa-header heading3"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderThreeButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderThreeButton;
