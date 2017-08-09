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
`
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
