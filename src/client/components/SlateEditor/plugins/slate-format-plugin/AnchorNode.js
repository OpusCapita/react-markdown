import React from 'react';

const style = {
  textDecoration: 'none'
};

const AnchorNode = ({node, attributes, children}) => {
  const {data} = node;
  const label = data.get('label');

  return (
    <a style={style}  name={label} {...attributes}>{children}︎</a>
  );
};


export default AnchorNode