import React from 'react';
import { codeMark, hasMark } from './CodeUtils';
import classnames from 'classnames';

const CodeButton = ({ state, onChange, className, style }) => (
  <button className={classnames({ 'btn btn-default': true, active: hasMark(state) })}
    onClick={e => onChange(codeMark(state))}
  >
    <i className="fa fa-code"/>
  </button>
);

export default CodeButton;
