import React from 'react';

const propTypes = {
  node: Types.object,
  attributes: Types.object
};

const defaultProps = {

};

const ImgNode = ({ node, attributes }) => {
  const { data } = node;
  const src = data.get('src');
  const alt = data.get('alt');

  return (
    <img {...attributes} src={src} alt={alt}/>
  );
};

ImgNode.propTypes = propTypes;
ImgNode.defaultProps = defaultProps;

export default ImgNode
