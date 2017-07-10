import React from 'react';

import AutocompleteContainer from './AutocompleteContainer';

const AutocompletePlugin = options => ({
  render(props, state, editor) {
    const { children } = props;
    return (
      <AutocompleteContainer editor={editor} state={state} options={options}>{children}</AutocompleteContainer>
    )
  }
});

export {
  AutocompletePlugin
}
