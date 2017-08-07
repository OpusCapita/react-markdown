import React from 'react';
import { Editor } from 'slate';
import Types from 'prop-types';
import classnames from 'classnames';
import './SlateContent.less';

const SlateContent = ({
  state,
  plugins,
  schema,
  onChange,
  children,
  isPlainMode,
  ...rest
}) => {
  return (
    <div
      className={classnames(
        'react-markdown--slate-content',
        { 'react-markdown--slate-content--plain-mode': isPlainMode }
      )}
    >
      <Editor
        spellCheck={false}
        plugins={plugins}
        state={state}
        schema={schema}
        onChange={onChange}
        {...rest}
      />
      {children}
    </div>
  );
};

SlateContent.propTypes = {
  plugins: Types.any,
  schema: Types.object,
  state: Types.any,
  onChange: Types.func,
  isPlainMode: Types.bool
};

SlateContent.defaultProps = {
  onChange: () => {},
  isPlainMode: false
};

export default SlateContent;
