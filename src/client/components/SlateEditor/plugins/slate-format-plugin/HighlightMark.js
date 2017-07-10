import React from 'react';

const style = {
  verticalAlign: 'sub',
  fontSize: 'smaller'
};

const HighlightMark = ({children}) => {
  return <mark style={style}>{children}</mark>
};

export default HighlightMark;