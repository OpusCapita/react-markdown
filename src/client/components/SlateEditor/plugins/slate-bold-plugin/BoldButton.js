import React from 'react';
import Types from 'prop-types';
import { boldMark, hasMark } from './BoldUtils';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const BoldButton = ({ state, onChange }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="bold-tp">Bold (Ctrl+B)</Tooltip>}>
    <button className={classnames({ 'btn btn-default': true, active: hasMark(state) })}
      onClick={e => onChange(boldMark(state))}
    >
      <i className="fa fa-bold"/>
    </button>
  </OverlayTrigger>
);

BoldButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default BoldButton;
