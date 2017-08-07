import React from 'react';
import Utils from './Utils';
import Types from 'prop-types';

const propTypes = {
  className: Types.string
};

const defaultProps = {
  className: ''
};

const SlateToolbar = ({ children, className, ...rest }) => (
  <div className={`btn-group ${className}`}>
    {Utils.cloneElement(children, rest)}
  </div>
);

SlateToolbar.propTypes = propTypes;
SlateToolbar.defaultProps = defaultProps;

export default SlateToolbar;
