import React from 'react';
import classnames from 'classnames';

import {isOrderedList, orderedList} from './ListUtils';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const OrderedListButton = ({state, onChange}) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="ordered-list-tp">Ordered List</Tooltip>}>
    <button className={classnames({'btn btn-default': true, active: isOrderedList(state)})}
            onClick={e => onChange(orderedList(state))}>
      <i className="fa fa-list-ol"/>
    </button>
  </OverlayTrigger>
);

export default OrderedListButton;
