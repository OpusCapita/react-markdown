import React from 'react';

const style = {
  fontWeight: 'bold',
  lineHeight: 1.42857143
};

const DefinitionTermNode = ({ children }) => {
  return <div style={style}>{children}</div>
};

export default DefinitionTermNode;
