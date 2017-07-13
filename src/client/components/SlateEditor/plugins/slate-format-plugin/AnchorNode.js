import React from 'react';
import Types from 'prop-types';

const style = {
  textDecoration: 'none'
};

const propTypes = {
  node: Types.object,
  attributes: Types.object
};

const AnchorNode = ({ node, attributes, children }) => {
  const { data } = node;
  const label = data.get('label');

  return (
    <a style={style} name={label} {...attributes}>{children}︎</a>
  );
};

AnchorNode.propTypes = propTypes;


export default AnchorNode
