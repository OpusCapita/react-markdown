import React from 'react';

const style = {
  marginLeft: 0,
  lineHeight: 1.42857143
};

const DefinitionNode = ({children}) => {
  return <div style={style}>{children}</div>
};

export default DefinitionNode;