import React from 'react';
import Types from 'prop-types';
import classnames from 'classnames';

import './SlateEditor.less';

class SlateEditor extends React.Component {
  render() {
    const { children, fullScreen } = this.props;
    return (
      <div
        className={classnames(
          'react-markdown--slate-editor',
          { 'react-markdown--slate-editor--fulscreen': fullScreen }
        )}
      >
        {children}
      </div>
    );
  }
}

SlateEditor.propTypes = {
  fullScreen: Types.bool,
};

export default SlateEditor;
