import React from 'react';
import Types from 'prop-types';
import { Mark } from 'slate';
import { parse } from './tokenizer';

let rendererComponent = props => {
  let isLine = props.node.type === 'line';
  let hasMarks = props.mark;

  if (isLine) {
    return (<div className="oc-md-hl-block">{props.children}</div>);
  }

  if (hasMarks && props.mark.type === 'code') {
    const className = props.mark ? 'oc-md-hl-' + props.mark.type : '';

    if (typeof props.children === 'string') {
      /* Wrap <span>children</span> - set cursor properly on mouse click inside "code" node */
      return (
        <span className={className}>
          <span>{props.children}</span>
          <span className="oc-md-hl-code-background"></span>
        </span>
      );
    }

    return (
      <span className={className}>
        {props.children}
        <span className="oc-md-hl-code-background"></span>
      </span>
    );
  }

  if (hasMarks) {
    const className = props.mark ? 'oc-md-hl-' + props.mark.type : '';
    return (
      <span className={className}>
        {props.children}
      </span>
    );
  }

  return null;
};

rendererComponent.propTypes = {
  node: Types.object,
  mark: Types.object
};

/**
 * Define a decorator for markdown styles.
 */

function addMarks(characters, tokens, offset) {
  let updatedOffset = offset;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (typeof token === 'string') {
      updatedOffset += token.length;
      continue;
    }

    const { content, length, type } = token;
    const mark = Mark.create({ type });

    for (let i = updatedOffset; i < updatedOffset + length; i++) {
      let char = characters.get(i);
      let { marks } = char;

      marks = marks.add(mark);
      char = char.set('marks', marks);
      characters.set(i, char);
    }

    if (Array.isArray(content)) {
      addMarks(characters, content, updatedOffset);
    }

    updatedOffset += length;
  }
}

let cache = {
  text: '',
  tokens: null
};

function markdownDecorator(text, block) {
  const characters = text.characters.asMutable();
  const string = text.text;

  if (string !== cache.text) {
    cache.text = string;
    cache.tokens = parse(string);
  }

  addMarks(characters, cache.tokens, 0);
  return characters.asImmutable();
}

const schema = {
  rules: [{
    match: () => true,
    decorate: markdownDecorator,
    render: rendererComponent
  }]
};

export default schema;
