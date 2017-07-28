import React from 'react';
import Utils from './Utils';
import './SlateToolbar.less';

export default ({ children, ...rest }) => (
  <div className="btn-toolbar react-markdown--toolbar">
    {Utils.cloneElement(children, rest)}
  </div>
);
