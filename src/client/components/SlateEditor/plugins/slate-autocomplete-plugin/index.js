import React from 'react';

import AutocompleteContainer from './AutocompleteContainer';

const AutocompletePlugin = options => ({
  render(props, state) {
    const { children } = props;

    return (
      <AutocompleteContainer
        state={state}
        options={options}
        onChange={options.onChange} // eslint-disable-line
        onMouseDown={options.onMouseDown} // eslint-disable-line
        onScroll={options.onScroll} // eslint-disable-line
      >
        {children}
      </AutocompleteContainer>
    );
  }
});

export {
  AutocompletePlugin
}
