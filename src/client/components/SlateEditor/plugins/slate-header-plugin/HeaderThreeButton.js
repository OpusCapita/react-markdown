import React from 'react';
import Types from 'prop-types';
import { hasBlock, unwrapBlock, wrapBlock } from './HeaderUtils';
import classnames from 'classnames';

import './HeaderStyles.css';


const HeaderThreeButton = ({ state, onChange }) => {
  const type = 'heading3';
  const active = hasBlock(state, type);
  return (
    <button className={classnames({ 'btn btn-default': true, active })}
      onClick={e => onChange(active ? unwrapBlock(state, type) : wrapBlock(state, type))}
    >
      <i className="fa fa-header heading3"/>
    </button>
  );
};

HeaderThreeButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default HeaderThreeButton;
