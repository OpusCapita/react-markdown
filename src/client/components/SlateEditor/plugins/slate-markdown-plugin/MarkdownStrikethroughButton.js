import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import {
  wrapStrikethroughMarkdown,
  hasStrikethroughMarkdown,
  unwrapStrikethroughMarkdown,
  hasMultiLineSelection,
} from './MarkdownUtils';

const MarkdownStrikethroughButton = ({ state, onChange, disabled }) => {
  const active = hasStrikethroughMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="strikethrough-tp">Strikethrough (Ctrl+S)</Tooltip>}>
      <button className={classnames('btn btn-default', { active })} disabled={disabled || hasMultiLineSelection(state)}
              onClick={e => onChange(active ? unwrapStrikethroughMarkdown(state) : wrapStrikethroughMarkdown(state))}
      >
        <i className="fa fa-strikethrough"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownStrikethroughButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownStrikethroughButton;
