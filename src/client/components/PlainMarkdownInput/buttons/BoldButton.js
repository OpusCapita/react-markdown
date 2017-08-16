import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import { wrapBoldMarkdown, unwrapBoldMarkdown, hasBoldMarkdown, hasMultiLineSelection } from '../slate/transforms';

const MarkdownBoldButton = ({ state, onChange, disabled }) => {
  const active = hasBoldMarkdown(state);

  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapBoldMarkdown(state) : wrapBoldMarkdown(state))}
      type="button"
      title="Bold (Ctrl + B)"
    >
      <i className="fa fa-bold"/>
    </button>
  );
};

MarkdownBoldButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func
};

export default MarkdownBoldButton;
