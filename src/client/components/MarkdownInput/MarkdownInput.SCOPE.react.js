/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

import text from './example.md';

@showroomScopeDecorator
export default
class MarkdownInputScope extends React.Component {
  state = {
    markdownExample: text,
    updatedMarkdown: text
  };

  handleValueChange = (value) => {
    console.log('handleValueChange', { value });
    this.setState({ updatedMarkdown: value });
  };

  render() {
    return (
      <div>
        <button onClick={_ => this.handleValueChange(text)}>Reset</button>
        {this._renderChildren()}
      </div>
    )
  }
}
