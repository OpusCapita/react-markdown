import React from 'react';
import {boldMark, hasMark} from './BoldUtils';
import classnames from 'classnames';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

const BoldButton = ({state, onChange}) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="bold-tp">Bold (Ctrl+B)</Tooltip>}>
    <button className={classnames({'btn btn-default': true, active: hasMark(state)})}
            onClick={e => onChange(boldMark(state))}>
      <i className="fa fa-bold"/>
    </button>
  </OverlayTrigger>
);

export default BoldButton;
