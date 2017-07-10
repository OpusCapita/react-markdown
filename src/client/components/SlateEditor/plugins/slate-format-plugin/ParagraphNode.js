import React from 'react';

const style = {
  margin: '0 0 10px',
};

const ParagraphNode = ({children}) => {
  return <p style={style}>{children}</p>
};

export default ParagraphNode;