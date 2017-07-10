import React from 'react';
import Utils from './Utils';

export default ({children, ...rest}) => (
  <div className="btn-group">
    {Utils.cloneElement(children, rest)}
  </div>
);
