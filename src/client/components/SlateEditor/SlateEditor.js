import React from 'react';
import Utils from './Utils';
import Types from 'prop-types';
import classnames from 'classnames';

import './SlateEditor.less';

class SlateEditor extends React.Component {
  render() {
    const { children, plugins, state, onChange, fullScreen } = this.props;
    return (
      <div
        className={classnames(
          'react-markdown--slate-editor',
          { 'react-markdown--slate-editor--fulscreen': fullScreen }
      )}>
        {Utils.cloneElement(children, { plugins, state, onChange })}
      </div>
    )
  }
}

SlateEditor.propTypes = {
  plugins: Types.any,
  state: Types.any,
  onChange: Types.func,
  fullScreen: Types.bool,
};

export default SlateEditor;
