import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  wrapStrikethroughMarkdown,
  hasStrikethroughMarkdown,
  unwrapStrikethroughMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownStrikethroughButton = ({ state, onChange, disabled, locale }) => {
  const active = hasStrikethroughMarkdown(state);
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapStrikethroughMarkdown(state) : wrapStrikethroughMarkdown(state))}
      type="button"
      title={getMessage(locale, 'strikethrough')}
    >
      <i className="fa fa-strikethrough"/>
    </button>
  );
};

MarkdownStrikethroughButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownStrikethroughButton.defaultProps = {
  locale: 'en-GB'
};

export default MarkdownStrikethroughButton;
