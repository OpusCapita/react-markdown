import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  wrapBoldMarkdown,
  unwrapBoldMarkdown,
  hasBoldMarkdown,
  hasMultiLineSelection
} from '../slate/transforms';

const MarkdownBoldButton = ({ state, onChange, disabled, locale }) => {
  const active = hasBoldMarkdown(state);

  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapBoldMarkdown(state) : wrapBoldMarkdown(state))}
      type="button"
      title={getMessage(locale, 'bold')}
    >
      <i className="fa fa-bold"/>
    </button>
  );
};

MarkdownBoldButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string
};

MarkdownBoldButton.defaultProps = {
  locale: 'en'
};

export default MarkdownBoldButton;
