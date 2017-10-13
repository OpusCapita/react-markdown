import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  hasAccent,
  wrapAccent,
  unwrapAccent,
  hasMultiLineSelection
} from '../slate/transforms';

const TITLES = {
  ul: 'bulletedList',
  ol: 'numberedList',
};
const CLASSNAMES = {
  ul: 'list-ul',
  ol: 'list-ol',
};

const ActionButton = ({ state, onChange, disabled, locale, accent }) => {
  const active = hasAccent(state, accent);

  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapAccent(state, accent) : wrapAccent(state, accent))}
      type="button"
      title={getMessage(locale, TITLES[accent] ? TITLES[accent] : accent)}
    >
      <i className={`fa fa-${CLASSNAMES[accent] ? CLASSNAMES[accent] : accent}`}/>
    </button>
  );
};

ActionButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string,
  accent: Types.string
};

ActionButton.defaultProps = {
  locale: 'en'
};

export default ActionButton;
