import React from 'react';
import classnames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function(props) {
  const { onClick, fullScreen } = props;
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">Fullscreen</Tooltip>}>
      <button className={classnames('btn btn-default')} onClick={onClick}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
}
