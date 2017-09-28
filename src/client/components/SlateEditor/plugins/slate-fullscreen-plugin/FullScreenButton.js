import React from 'react';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Types from 'prop-types';

const FullScreenButton = function({ onClick, fullScreen }) {
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">Fullscreen</Tooltip>}>
      <button type="button" className={classnames('btn btn-default')} onClick={onClick}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
};

FullScreenButton.propTypes = {
  onClick: Types.func,
  fullScreen: Types.bool
};

FullScreenButton.defaultProps = {
  onClick: () => {},
  fullScreen: false
};

export default FullScreenButton;
