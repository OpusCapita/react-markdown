/*
 What is a SCOPE file. See documentation here:
 https://github.com/OpusCapita/react-showroom-client/blob/master/docs/scope-component.md
 */

import React, { Component, PropTypes } from 'react';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';

@showroomScopeDecorator
export default
class TestEditorScope extends Component {
  render() {
    return (
      <div style={{ "borderStyle": "solid" }}>
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
