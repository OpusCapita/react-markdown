import React from 'react';
import Types from 'prop-types';
import { Mark } from 'slate';

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

const addMarks = function addMarks(characters, tokens, offset) {
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
};

/**
 * Object caches the last values of tokens and characters
 * if the text hasn't changed, returns characters from the cache
 * if the text has changed, tokens and characters are recalculated and save in a cache
 */
const charactersCache = {
  lastText: null,
  lastCharacters: null,

  setCharacters(text, tokens, blockText) {
    this.lastText = blockText;
    let characters = text.characters.asMutable();
    addMarks(characters, tokens, 0); // Add marks to characters
    this.lastCharacters = characters.asImmutable();
  },

  decorate(text, block) {
    if (block.data) {
      let blockText = block.data.text;
      if (blockText && blockText === text.text && blockText !== this.lastText) {
        this.setCharacters(text, block.data.tokens, blockText);
      }
    }
    return this.lastCharacters;
  }
};

const schema = {
  rules: [{
    match: () => true,
    decorate: charactersCache.decorate.bind(charactersCache),
    render: rendererComponent
  }]
};

export default schema;
