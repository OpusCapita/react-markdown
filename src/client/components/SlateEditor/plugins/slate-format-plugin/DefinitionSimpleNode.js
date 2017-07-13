import React from 'react';

const style = {
  marginLeft: 0,
  lineHeight: 1.42857143,
  display: 'block'
};

const DefinitionSimpleNode = ({ children }) => {
  return <dd style={style}>{children}</dd>
};

export default DefinitionSimpleNode;
