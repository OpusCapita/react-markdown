import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import { isUnorderedList, unorderedList } from './ListUtils';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const UnorderedListButton = ({ state, onChange }) => (
  <OverlayTrigger placement="bottom" overlay={<Tooltip id="unordered-list-tp">Unordered List</Tooltip>}>
    <button className={classnames({ 'btn btn-default': true, active: isUnorderedList(state) })}
      onClick={e => onChange(unorderedList(state))}
    >
      <i className="fa fa-list-ul"/>
    </button>
  </OverlayTrigger>
);

UnorderedListButton.propTypes = {
  state: Types.object,
  onChange: Types.func
};

UnorderedListButton.defaultProps = {
  onChange: () => {}
};

export default UnorderedListButton;
