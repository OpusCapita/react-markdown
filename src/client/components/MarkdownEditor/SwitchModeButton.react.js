import React from 'react';
import classnames from 'classnames';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

export default function(props) {
  const {onChangeMode, mode} = props;
  const active = mode === 'plain';

  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="switch-tp">{!active ? 'Plain Mode' : 'Rich Mode'}</Tooltip>}>
      <button className={classnames('btn btn-default', {active})}
              onClick={onChangeMode.bind(this, active ? 'rich' : 'plain')}>
        <i className="fa fa-code"/>
      </button>
    </OverlayTrigger>
  );
}