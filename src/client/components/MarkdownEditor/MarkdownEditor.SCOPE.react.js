/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

import text from './example.md';

@showroomScopeDecorator
export default
class MarkdownEditorScope extends React.Component {
  state = {
    value: text
  };

  handleValueChange = (value) => {
    this.setState({ value });
  }

  render() {
    return (
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'row' }}>
        {this._renderChildren()}
      </div>
    );
  }
}
