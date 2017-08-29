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
      >
        {children}
      </AutocompleteContainer>
    );
  }
});

export {
  AutocompletePlugin
}
