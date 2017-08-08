import React from 'react';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import PropTypes from 'prop-types';

const FullScreenButton = function({ onClick, fullScreen }) {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">Fullscreen</Tooltip>}>
      <button className={classnames('btn btn-default')} onClick={onClick}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
};

FullScreenButton.propTypes = {
  onFullScreen: PropTypes.func,
  fullScreen: PropTypes.bool
};


export default FullScreenButton;
