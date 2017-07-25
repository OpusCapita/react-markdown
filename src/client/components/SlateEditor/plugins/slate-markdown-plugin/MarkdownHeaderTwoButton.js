import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapHeaderTwoMarkdown,
  hasMultiLineSelection,
  hasHeaderTwoMarkdown,
  unwrapHeaderTwoMarkdown
} from './MarkdownUtils';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import './HeaderStyles.css';

const MarkdownHeaderTwoButton = ({ state, onChange, disabled }) => {
  const active = hasHeaderTwoMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="h2-tp">Header size 2</Tooltip>}>
      <button className={classnames('btn btn-default', { active })}
        disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapHeaderTwoMarkdown(state) : wrapHeaderTwoMarkdown(state))}
      >
        <i className="fa fa-header heading2"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownHeaderTwoButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownHeaderTwoButton;
