import React from 'react';
import { Editor } from 'slate';

export default ({
  state,
  plugins,
  onChange,
  children,
  ...rest
}) => {

  return (
    <div className="editor-content">
      <Editor
        spellCheck
        plugins={plugins}
        state={state}
        onChange={onChange}
        {...rest}
      />
      {children}
    </div>
  );
}
