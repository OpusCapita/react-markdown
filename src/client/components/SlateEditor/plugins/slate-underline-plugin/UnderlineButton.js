import React from 'react';
import classnames from 'classnames';
import { hasMark, underlineMark } from './UnderlineUtils';

const UnderlineButton = ({ state, onChange }) => (
  <button className={classnames({ 'btn btn-default': true, active: hasMark(state) })}
    onClick={e => onChange(underlineMark(state))}
  >
    <i className="fa fa-underline"/>
  </button>
);

export default UnderlineButton;
