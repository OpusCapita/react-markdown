import React from 'react';
import Utils from './Utils';

export default ({ children, className, ...rest }) => (
  <div className={`btn-group ${className || ''}`}>
    {Utils.cloneElement(children, rest)}
  </div>
);
