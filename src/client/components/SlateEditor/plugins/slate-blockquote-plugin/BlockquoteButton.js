import React from 'react';
import classnames from 'classnames';
import {hasBlock, unwrapBlock, wrapBlock} from './BlockquoteUtils';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';


const BlockquoteButton = ({state, onChange}) => {
  const active = hasBlock(state);
  return (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id="block-quote-tp">Blockquote</Tooltip>}>
      <button className={classnames({'btn btn-default': true, 'active': active})}
              onClick={e => onChange(active ? unwrapBlock(state) : wrapBlock(state))}>
        <i className="fa fa-quote-right"/>
      </button>
    </OverlayTrigger>
  );
};

export default BlockquoteButton;
