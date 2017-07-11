import React from 'react';
import Types from 'prop-types';
import { hasMark, italicMark } from './ItalicUtils';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const ItalicButton = ({ state, onChange }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="bold-tp">Italic (Ctrl+I)</Tooltip>}>
    <button className={classnames({ 'btn btn-default': true, active: hasMark(state) })}
      onClick={e => onChange(italicMark(state))}
    >
      <i className="fa fa-italic"/>
    </button>
  </OverlayTrigger>
);

ItalicButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

export default ItalicButton;
