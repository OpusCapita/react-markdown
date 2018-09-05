import React from 'react';
import PropTypes from 'prop-types';

const maxItemLength = 15;

export default function DefaultAutocompleteItem({ item, selected }) {
  const itemLabel = item._objectLabel;
  const itemLength = itemLabel.length;

  return (
    <div
      className={`
        react-markdown--autocomplete-widget__item
        ${selected ? 'react-markdown--autocomplete-widget__item--active' : ''}
      `}
      title={itemLength > maxItemLength ? itemLabel : ''}
    >
      {itemLength > maxItemLength ? `${itemLabel.substr(0, maxItemLength)}…` : itemLabel}
    </div>
  );
}

DefaultAutocompleteItem.propTypes = {
  item: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired
};
