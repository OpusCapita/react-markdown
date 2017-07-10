import React from 'react';
import Types from 'prop-types';

const ListItemNode = ({ attributes, children }) => (
  <li {...attributes}>
    {children}
  </li>
);

ListItemNode.propTypes = {
  attributes: Types.object
};

ListItemNode.defaultProps = {
  attributes: {}
};

export default ListItemNode;
