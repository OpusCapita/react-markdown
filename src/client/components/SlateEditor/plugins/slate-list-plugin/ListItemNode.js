import React from 'react';
import Types from 'prop-types';

const ListItemNode = ({ node, attributes, children }) => (
  <li value={node.getIn(['data', 'itemNum'])} {...attributes}>
    {children}
  </li>
);

ListItemNode.propTypes = {
  attributes: Types.object,
  node: Types.object,
};

ListItemNode.defaultProps = {
  attributes: {}
};

export default ListItemNode;
