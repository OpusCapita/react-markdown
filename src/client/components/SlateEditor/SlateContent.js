import React from 'react';
import { Editor } from 'slate-react';
import Types from 'prop-types';
import './SlateContent.less';

const SlateContent = ({
  state,
  plugins,
  schema,
  onChange,
  children,
  ...rest
}) => {
  return (
    <div className={'react-markdown--slate-content'}>
      <Editor
        spellCheck={false}
        plugins={plugins}
        state={state}
        schema={schema}
        onChange={onChange}
        className={`react-markdown--slate-content__editor`}
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
  onChange: Types.func
};

SlateContent.defaultProps = {
  onChange: () => {}
};

export default SlateContent;
