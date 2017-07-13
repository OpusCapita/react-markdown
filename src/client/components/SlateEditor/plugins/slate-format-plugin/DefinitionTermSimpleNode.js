import React from 'react';

const style = {
  fontWeight: 'bold',
  lineHeight: 1.42857143
};

const DefinitionTermSimpleNode = ({ children }) => {
  return <dt style={style}>{children}</dt>
};

export default DefinitionTermSimpleNode;
