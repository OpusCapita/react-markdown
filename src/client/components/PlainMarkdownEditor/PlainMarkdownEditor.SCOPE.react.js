/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

@showroomScopeDecorator
export default
class TestEditorScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: `
# Initial raw markdown

* List item 1
* List item 2
* List item 3
`,
      /* autocompletes: [{
       termRegex: /\$(\w*)$/,
       fetch: (term) => {
       switch(term) {
       case '$':
       return Promise.resolve([
       { _objectLabel: '1s' },
       { _objectLabel: '2f' },
       { _objectLabel: '2s' }
       ]);
       case '$1':
       return Promise.resolve([
       { _objectLabel: '1s' }
       ]);
       case '$2':
       return Promise.resolve([
       { _objectLabel: '2f' },
       { _objectLabel: '2s' }
       ]);
       default:
       return Promise.resolve([])
       }
       },
       selectItem: (item) => { return `ITEM$: ${item._objectLabel}` }
       }, {
       termRegex: /\!(\w*)/,
       fetch: (term) => {
       switch(term) {
       case '!':
       return Promise.resolve([
       { _objectLabel: '3a' },
       { _objectLabel: '4a' }
       ]);
       case '!3':
       return Promise.resolve([
       { _objectLabel: '3a' }
       ]);
       case '!4':
       return Promise.resolve([
       { _objectLabel: '4a' }
       ]);
       default:
       return Promise.resolve([])
       }
       },
       selectItem: (item) => { return `ITEM!: ${item._objectLabel}` }
       }]*/
    };

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}

TestEditorScope.contextTypes = {
  i18n: PropTypes.object
};
TestEditorScope.childContextTypes = {
  i18n: PropTypes.object
};
