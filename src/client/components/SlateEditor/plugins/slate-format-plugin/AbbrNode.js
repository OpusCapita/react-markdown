import React from 'react';
import Types from 'prop-types';

const style = {
  cursor: 'help',
  borderBottom: '1px dotted #777'
};

const propTypes = {
  node: Types.object,
  attributes: Types.object
};

const AbbrNode = ({ node, attributes, children }) => {
  const { data } = node;
  const title = data.get('title');

  return (
    <abbr style={style} {...attributes} title={title}>{children}</abbr>
  );
};

AbbrNode.propTypes = propTypes;


export default AbbrNode
