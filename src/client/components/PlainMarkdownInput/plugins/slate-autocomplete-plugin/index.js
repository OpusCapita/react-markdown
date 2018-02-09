import React from 'react';

import AutocompleteContainer from './AutocompleteContainer';

const AutocompletePlugin = options => ({
  render(props, state) {
    const { children } = props;

    return (
      <AutocompleteContainer
        state={state}
        options={options}
        locale={options.locale}
        onChange={options.onChange} // eslint-disable-line
        onScroll={options.onScroll} // eslint-disable-line
        onMouseUp={options.onMouseUp} // eslint-disable-line
        onToggle={options.onToggle} // eslint-disable-line
      >
        {children}
      </AutocompleteContainer>
    );
  }
});

export {
  AutocompletePlugin
}
