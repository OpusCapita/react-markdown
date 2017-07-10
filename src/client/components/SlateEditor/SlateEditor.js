import React from 'react';
import Utils from './Utils';
import classnames from 'classnames';

import './SlateEditor.less';

class SlateEditor extends React.Component {
  render () {
    const { children, plugins, state, onChange, fullScreen} = this.props;
    return (
      <div className={classnames('slate-editor', {fullScreen})}>
        {Utils.cloneElement(children, { plugins, state, onChange})}
      </div>
    )
  }
}

export default SlateEditor;
