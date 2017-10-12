import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  wrapOrderedListMarkdown,
  hasOrderedListMarkdown,
  unwrapOrderedListMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownOrderedListButton = ({ state, onChange, disabled, locale }) => {
  const active = hasOrderedListMarkdown(state);
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapOrderedListMarkdown(state) : wrapOrderedListMarkdown(state))}
      type="button"
      title={getMessage(locale, 'numberedList')}
    >
      <i className="fa fa-list-ol"/>
    </button>
  )
};

MarkdownOrderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownOrderedListButton.defaultProps = {
  locale: 'en-GB'
};

export default MarkdownOrderedListButton;
