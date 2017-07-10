import React from 'react';

const style = {
  verticalAlign: 'super',
  fontSize: 'smaller'
};

const SuperscriptMark = ({children}) => {
  return <sup style={style}>{children}</sup>
};

export default SuperscriptMark;