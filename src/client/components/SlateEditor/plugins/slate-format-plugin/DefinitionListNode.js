import React from 'react';

const style = {
  marginTop: 0,
  marginBottom: '20px'
};

const DefinitionListNode = ({children}) => {
  return <div style={style}>{children}</div>
};

export default DefinitionListNode;