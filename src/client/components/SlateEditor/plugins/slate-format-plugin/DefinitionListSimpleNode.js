import React from 'react';

const style = {
  marginTop: 0,
  marginBottom: '20px'
};

const DefinitionListSimpleNode = ({ children }) => {
  return <dl style={style}>{children}</dl>
};

export default DefinitionListSimpleNode;
