import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  hasHeader,
  wrapHeader,
  unwrapHeader,
} from '../slate/transforms';

const titles = [
  '',
  'Header 1',
  'Header 2',
  'Header 3',
  'Header 4',
  'Header 5',
  'Header 6',
];


const HeaderButton = ({ state, onChange, level }) => {
  const active = hasHeader(state, level);
  return (
    <MenuItem
      onClick={e => onChange(active ? unwrapHeader(state, level) : wrapHeader(state, level))}
    >
      <strong>{titles[level]}</strong>
    </MenuItem>
  );
};

HeaderButton.propTypes = {
  state: Types.object,
  onChange: Types.func,
  level: Types.number
};

export default HeaderButton;
