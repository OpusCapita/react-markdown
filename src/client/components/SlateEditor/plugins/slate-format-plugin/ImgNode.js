import React from 'react';


const ImgNode = ({node, attributes}) => {
  const {data} = node;
  const src = data.get('src');
  const alt = data.get('alt');

  console.log(data);

  return (
    <img {...attributes} src={src} alt={alt}/>
  );
};


export default ImgNode