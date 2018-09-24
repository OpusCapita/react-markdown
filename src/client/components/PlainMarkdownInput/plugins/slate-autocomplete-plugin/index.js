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
        onChange={options.onChange} // eslint-disable-line react/jsx-handler-names
        onScroll={options.onScroll} // eslint-disable-line react/jsx-handler-names
        onMouseUp={options.onMouseUp} // eslint-disable-line react/jsx-handler-names
        onToggle={options.onToggle} // eslint-disable-line react/jsx-handler-names
      >
        {children}
      </AutocompleteContainer>
    );
  }
});

export {
  AutocompletePlugin
}
