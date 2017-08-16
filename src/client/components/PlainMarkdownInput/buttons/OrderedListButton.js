import React from 'react';
import Types from 'prop-types';

import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import {
  wrapOrderedListMarkdown,
  hasOrderedListMarkdown,
  unwrapOrderedListMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownOrderedListButton = ({ state, onChange, disabled }) => {
  const active = hasOrderedListMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="ordered-list-tp">Numbered list</Tooltip>}>
      <button className={classnames('btn btn-default', { active })} disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapOrderedListMarkdown(state) : wrapOrderedListMarkdown(state))}
      >
        <i className="fa fa-list-ol"/>
      </button>
    </OverlayTrigger>
  )
};

MarkdownOrderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownOrderedListButton;
