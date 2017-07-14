import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import { wrapItalicMarkdown, unwrapItalicMarkdown, hasItalicMarkdown, hasMultiLineSelection } from './MarkdownUtils';

const MarkdownItalicButton = ({ state, onChange, disabled }) => {
  const active = hasItalicMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="italic-tp">Italic (Ctrl+I)</Tooltip>}>
      <button className={classnames('btn btn-default', { active })} disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapItalicMarkdown(state) : wrapItalicMarkdown(state))}
      >
        <i className="fa fa-italic"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownItalicButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownItalicButton;
