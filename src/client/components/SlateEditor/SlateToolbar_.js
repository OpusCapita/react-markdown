import React from 'react';
import Utils from './Utils';
import './SlateToolbar.less';

export default ({ children, ...rest }) => (
  <div className="react-markdown--toolbar">
    {Utils.cloneElement(children, rest)}
  </div>
);
