import React from 'react';

const style = {
  fontStyle: 'normal',
};

const EmojiesMark = ({children}) => {
  return <span style={style}>{children}</span>
};

export default EmojiesMark;