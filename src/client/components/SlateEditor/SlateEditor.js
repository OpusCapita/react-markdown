import React from 'react';
import Utils from './Utils';

import './SlateEditor.less';

const fullScreenStyles = {
  bottom: '0',
  left: '0',
  margin: '0',
  position: 'fixed',
  right: '0',
  top: '0',
  width: 'auto',
  zIndex: '999',
  backgroundColor: 'white'
};

class SlateEditor extends React.Component {
  render () {
    const { children, plugins, state, onChange, fullScreen} = this.props;

    const styles = fullScreen ? fullScreenStyles : {};
    return (
      <div className="slate-editor" style={styles}>
        {Utils.cloneElement(children, { plugins, state, onChange})}
      </div>
    )
  }
}

export default SlateEditor;
