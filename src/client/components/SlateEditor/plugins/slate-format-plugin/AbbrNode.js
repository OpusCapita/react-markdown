import React from 'react';

const style = {
  cursor: 'help',
  borderBottom: '1px dotted #777'
};

const AbbrNode = ({node, attributes, children}) => {
  const {data} = node;
  const title = data.get('title');

  return (
    <abbr style={style} {...attributes} title={title}>{children}</abbr>
  );
};


export default AbbrNode