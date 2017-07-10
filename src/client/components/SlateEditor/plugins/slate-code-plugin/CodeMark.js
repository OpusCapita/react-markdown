import React from 'react';

const style = {
  fontFamily: 'monospace',
  backgroundColor: '#eee',
  padding: '3px',
  borderRadius: '4px'
};

const CodeMark = ({children}) => (
  <code style={style}>
    {children}
  </code>
);

export default CodeMark;