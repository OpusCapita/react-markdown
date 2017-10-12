import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  wrapUnorderedListMarkdown,
  hasUnorderedListMarkdown,
  unwrapUnorderedListMarkdown,
  hasMultiLineSelection,
} from '../slate/transforms';

const MarkdownUnorderedListButton = ({ state, onChange, disabled, locale }) => {
  const active = hasUnorderedListMarkdown(state);
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapUnorderedListMarkdown(state) : wrapUnorderedListMarkdown(state))}
      type="button"
      title={getMessage(locale, 'bulletedList')}
    >
      <i className="fa fa-list-ul"/>
    </button>
  );
};

MarkdownUnorderedListButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownUnorderedListButton.defaultProps = {
  locale: 'en-GB'
};

export default MarkdownUnorderedListButton;
