import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import { wrapBoldMarkdown, unwrapBoldMarkdown, hasBoldMarkdown, hasMultiLineSelection } from './MarkdownUtils';

const MarkdownBoldButton = ({ state, onChange, disabled }) => {
  const active = hasBoldMarkdown(state);

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="bold-tp">Bold (Ctrl+B)</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapBoldMarkdown(state) : wrapBoldMarkdown(state))}
      >
        <i className="fa fa-bold"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownBoldButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBoldButton;
