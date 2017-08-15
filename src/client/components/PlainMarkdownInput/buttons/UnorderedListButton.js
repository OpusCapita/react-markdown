import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import {
  wrapUnorderedListMarkdown,
  hasUnorderedListMarkdown,
  unwrapUnorderedListMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownUnorderedListButton = ({ state, onChange, disabled }) => {
  const active = hasUnorderedListMarkdown(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="unordered-list-tp">Bullet list</Tooltip>}>
      <button className={classnames('btn btn-default', { active })} disabled={disabled || hasMultiLineSelection(state)}
        onClick={e => onChange(active ? unwrapUnorderedListMarkdown(state) : wrapUnorderedListMarkdown(state))}
      >
        <i className="fa fa-list-ul"/>
      </button>
    </OverlayTrigger>
  );
};

MarkdownUnorderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownUnorderedListButton;
