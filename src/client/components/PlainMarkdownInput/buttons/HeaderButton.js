import React from 'react';
import Types from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const titles = [
  '',
  'Header 1',
  'Header 2',
  'Header 3',
  'Header 4',
  'Header 5',
  'Header 6',
];


const HeaderButton = ({ onClick, level }) => {
  return (
    <MenuItem
      onClick={e => onClick(level)}
    >
      <strong>{titles[level]}</strong>
    </MenuItem>
  );
};

HeaderButton.propTypes = {
  onClick: Types.func,
  level: Types.number
};

export default HeaderButton;
