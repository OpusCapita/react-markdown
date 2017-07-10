import React from 'react';
import Types from 'prop-types';
import { codeMark, hasMark } from './CodeUtils';
import classnames from 'classnames';

const CodeButton = ({ state, onChange }) => (
  <button className={classnames({ 'btn btn-default': true, active: hasMark(state) })}
    onClick={e => onChange(codeMark(state))}
  >
    <i className="fa fa-code"/>
  </button>
);

CodeButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default CodeButton;
