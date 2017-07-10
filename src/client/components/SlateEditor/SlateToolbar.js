import React from 'react';
import Utils from './Utils';

export default ({ children, ...rest }) => (
  <div className="btn-toolbar editor-toolbar">
    {Utils.cloneElement(children, rest)}
  </div>
);
