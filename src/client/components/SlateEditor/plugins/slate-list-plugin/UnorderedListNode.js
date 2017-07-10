import React from 'react';
import Types from 'prop-types';

const UnorderedListNode = ({ attributes, children }) => (
  <ul {...attributes}>
    {children}
  </ul>
);

UnorderedListNode.propTypes = {
  attributes: Types.object
};

UnorderedListNode.defaultProps = {
  attributes: {}
};

export default UnorderedListNode;
