import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

const TITLES = {
  ul: 'bulletedList',
  ol: 'numberedList',
};
const CLASSNAMES = {
  ul: 'list-ul',
  ol: 'list-ol',
};

const ActionButton = ({ onClick, disabled, locale, accent, active }) => {
  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled}
      onClick={e => onClick(accent)}
      type="button"
      title={getMessage(locale, TITLES[accent] ? TITLES[accent] : accent)}
    >
      <i className={`fa fa-${CLASSNAMES[accent] ? CLASSNAMES[accent] : accent}`}/>
    </button>
  );
};

ActionButton.propTypes = {
  accent: Types.string,
  active: Types.bool,
  disabled: Types.bool,
  locale: Types.string,
  onClick: Types.func,
};

ActionButton.defaultProps = {
  active: false,
  disabled: false,
  locale: 'en'
};

export default ActionButton;
