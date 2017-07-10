/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React, {Component, PropTypes} from 'react';
import {showroomScopeDecorator} from '@opuscapita/react-showroom-client';

import text from './example.md';

@showroomScopeDecorator
export default
class MarkdownEditorScope extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: text,
      /*autocompletes: [
       {
       termRegex: /^\$(\w*)$/,
       fetch(term) {
       const items = [
       { _objectLabel: 'a1' },
       { _objectLabel: 'a2' },
       { _objectLabel: 'a23' },
       { _objectLabel: 'b1' },
       { _objectLabel: 'ba2' },
       { _objectLabel: 'ba21' },
       { _objectLabel: 'ba222' },
       { _objectLabel: 'ba23' },
       { _objectLabel: 'ba24' },
       { _objectLabel: 'ba25' },
       { _objectLabel: 'ba255' },
       { _objectLabel: 'ba256' },
       { _objectLabel: 'ba257' },
       ];
       return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
       },
       selectItem(item) {
       return '$' + item._objectLabel;
       }
       },
       {
       termRegex: /^\#(\w*)$/,
       fetch(term) {
       const items = [
       { _objectLabel: 'a1' },
       { _objectLabel: 'a2' },
       { _objectLabel: 'a23' },
       { _objectLabel: 'b1' },
       { _objectLabel: 'ba2' },
       { _objectLabel: 'ba21' },
       { _objectLabel: 'ba222' },
       { _objectLabel: 'ba23' },
       { _objectLabel: 'ba24' },
       { _objectLabel: 'ba25' },
       { _objectLabel: 'ba255' },
       { _objectLabel: 'ba256' },
       { _objectLabel: 'ba257' },
       ];
       return Promise.resolve(items.filter(({_objectLabel}) => _objectLabel.startsWith(term.substring(1))));
       },
       selectItem(item) {
       return '#' + item._objectLabel;
       }
       }
       ]*/
    };

    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value) {
    this.setState({value});
  }

  render() {
    const {value} = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: '70vh'}}>
        {this._renderChildren()}

        <div style={{
          flex: '1 0 auto',
          overflow: 'auto',
          marginLeft: '12px',
          minWidth: '300px'
        }}>
          <pre>{value}</pre>
        </div>
      </div>
    );
  }
}

MarkdownEditorScope.contextTypes = {
  i18n: PropTypes.object
};
MarkdownEditorScope.childContextTypes = {
  i18n: PropTypes.object
};
