import React from 'react';

const style = {
  verticalAlign: 'sub',
  fontSize: 'smaller'
};

const SubscriptMark = ({ children }) => {
  return <sub style={style}>{children}</sub>
};

export default SubscriptMark;
