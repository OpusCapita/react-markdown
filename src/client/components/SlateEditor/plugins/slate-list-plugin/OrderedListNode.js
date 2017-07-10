import React from 'react';
import Types from 'prop-types';

const OrderedListNode = ({ attributes, children }) => (
  <ol {...attributes}>
    {children}
  </ol>
);

OrderedListNode.propTypes = {
  attributes: Types.object
};

OrderedListNode.defaultProps = {
  attributes: {}
};

export default OrderedListNode;
