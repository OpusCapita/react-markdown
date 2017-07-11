import React from 'react';
import classnames from 'classnames';
import Types from 'prop-types';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const FullScreenButton = function(props) {
  const { onFullScreen, fullScreen } = props;
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">Fullscreen</Tooltip>}>
      <button className={classnames('btn btn-default')} onClick={() => onFullScreen(!fullScreen)}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
};

FullScreenButton.propTypes = {
  fullScreen: Types.bool,
  onFullScreen: Types.func
};

export default FullScreenButton;
