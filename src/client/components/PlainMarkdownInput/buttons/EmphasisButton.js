import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';
import getMessage from '../../translations';

import {
  hasEmphasis,
  wrapEmphasis,
  unwrapEmphasis,
  hasMultiLineSelection
} from '../slate/transforms';

const EmphasisButton = ({ state, onChange, disabled, locale, accent }) => {
  const active = hasEmphasis(state, accent);

  return (
    <button
      className={classnames('btn btn-default', { active })}
      disabled={disabled || hasMultiLineSelection(state)}
      onClick={e => onChange(active ? unwrapEmphasis(state, accent) : wrapEmphasis(state, accent))}
      type="button"
      title={getMessage(locale, accent)}
    >
      <i className={`fa fa-${accent}`}/>
    </button>
  );
};

EmphasisButton.propTypes = {
  disabled: Types.bool,
  state: Types.object,
  onChange: Types.func,
  locale: Types.string,
  accent: Types.string
};

EmphasisButton.defaultProps = {
  locale: 'en'
};

export default EmphasisButton;
