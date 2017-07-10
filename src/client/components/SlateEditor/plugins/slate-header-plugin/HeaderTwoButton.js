import React from 'react';
import {hasBlock, unwrapBlock, wrapBlock} from './HeaderUtils';
import classnames from 'classnames';

import './HeaderStyles.css';


const HeaderTwoButton = ({state, onChange}) => {
  const type = 'heading2';
  const active = hasBlock(state, type);
  return (
    <button className={classnames({'btn btn-default': true, active})}
            onClick={e => onChange(active ? unwrapBlock(state, type) : wrapBlock(state, type))}>
      <i className="fa fa-header heading2"/>
    </button>
  );
};

export default HeaderTwoButton;
