import React from 'react';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Types from 'prop-types';
import getMessage from '../../../translations';

import './FullScreenStyles.css';

const FullScreenButton = function({ onClick, fullScreen, locale }) {
  const tooltip = <Tooltip id="switch-tp" className="fullscreen-tp">{getMessage(locale, 'fullscreen')}</Tooltip>;
  return (
    <OverlayTrigger placement="bottom" overlay={tooltip}>
      <button type="button" className={classnames('btn btn-default')} onClick={onClick}>
        <i className={classnames('fa', { 'fa-expand': !fullScreen, 'fa-compress': fullScreen })}/>
      </button>
    </OverlayTrigger>
  );
};

FullScreenButton.propTypes = {
  onClick: Types.func,
  fullScreen: Types.bool,
  locale: Types.string
};

FullScreenButton.defaultProps = {
  onClick: () => {},
  fullScreen: false,
  locale: 'en-GB'
};

export default FullScreenButton;
