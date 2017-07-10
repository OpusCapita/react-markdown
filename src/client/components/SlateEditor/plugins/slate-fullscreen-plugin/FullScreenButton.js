import React from 'react';
import classnames from 'classnames';
import Types from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const FullScreenButton = function(props) {
  const { onClick, fullScreen } = props;
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">Fullscreen</Tooltip>}>
      <button className={classnames('btn btn-default')} onClick={onClick}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
};

FullScreenButton.propTypes = {
  fullScreen: Types.bool,
  onClick: Types.func
};

export default FullScreenButton;

