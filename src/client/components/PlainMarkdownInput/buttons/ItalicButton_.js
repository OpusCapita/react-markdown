import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  wrapItalicMarkdown,
  unwrapItalicMarkdown,
  hasItalicMarkdown,
  hasMultiLineSelection
} from '../slate/transforms';

const MarkdownItalicButton = ({ state, onChange, disabled, locale }) => {
  const active = hasItalicMarkdown(state);
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapItalicMarkdown(state) : wrapItalicMarkdown(state))}
      type="button"
      title={getMessage(locale, 'italic')}
    >
      <i className="fa fa-italic"/>
    </button>
  );
};

MarkdownItalicButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownItalicButton.defaultProps = {
  locale: 'en'
};

export default MarkdownItalicButton;
