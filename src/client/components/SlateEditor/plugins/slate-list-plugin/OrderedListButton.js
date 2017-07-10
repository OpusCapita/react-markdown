import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import { isOrderedList, orderedList } from './ListUtils';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const OrderedListButton = ({ state, onChange }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="ordered-list-tp">Ordered List</Tooltip>}>
    <button className={classnames({ 'btn btn-default': true, active: isOrderedList(state) })}
      onClick={e => onChange(orderedList(state))}
    >
      <i className="fa fa-list-ol"/>
    </button>
  </OverlayTrigger>
);

OrderedListButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

OrderedListButton.defaultProps = {
  onChange: () => {}
};

export default OrderedListButton;
