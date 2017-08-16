import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import {
  wrapStrikethroughMarkdown,
  hasStrikethroughMarkdown,
  unwrapStrikethroughMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownStrikethroughButton = ({ state, onChange, disabled }) => {
  const active = hasStrikethroughMarkdown(state);
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapStrikethroughMarkdown(state) : wrapStrikethroughMarkdown(state))}
      type="button"
      title="Strikethrough (Ctrl + S)"
    >
      <i className="fa fa-strikethrough"/>
    </button>
  );
};

MarkdownStrikethroughButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownStrikethroughButton;
