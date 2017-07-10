import React from 'react';
import { Editor } from 'slate';
import Types from 'prop-types';

const SlateContent = ({
                  state,
                  plugins,
                  onChange,
                  children,
                  ...rest
                }) => {
  return (
    <div className="editor-content">
      <Editor
        spellCheck={true}
        plugins={plugins}
        state={state}
        onChange={onChange}
        {...rest}
      />
      {children}
    </div>
  );
};

SlateContent.propTypes = {
  plugins: Types.any,
  state: Types.any,
  onChange: Types.func
};

export default SlateContent;
