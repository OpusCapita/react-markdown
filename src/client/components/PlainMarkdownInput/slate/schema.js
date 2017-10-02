import React from 'react';
import Types from 'prop-types';
import { Mark } from 'slate';

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
    for (let i = updatedOffset; i < updatedOffset + length && i < characters.size; i++) {
      let char = characters.get(i);
      let { marks } = char;

      marks = marks.add(mark);
      char = char.set('marks', marks);
      characters.set(i, char);
    }

    addMarks(characters, content, updatedOffset);

    updatedOffset += length;
  }
};

function markdownDecorator(text, block) {
  if (text.charsData && text.charsData.text === text.text) {
    return text.charsData.characters;
  }
  if (block.data) {
    let characters = text.characters.asMutable();
    addMarks(characters, block.data.tokens, 0); // Add marks to characters
    text.charsData = { // eslint-disable-line
      text: text.text,
      characters: characters.asImmutable()
    };
    return text.charsData.characters;
  }
  return text.characters;
}

let rendererComponent = props => {
  let isLine = props.node.type === 'line';
  let hasMarks = props.mark;

  if (isLine) {
    return (<div className="oc-md-hl-block">{props.children}</div>);
  }

  if (hasMarks) {
    const className = props.mark.type ? 'oc-md-hl-' + props.mark.type : '';
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

const schema = {
  rules: [{
    match: () => true,
    decorate: markdownDecorator,
    render: rendererComponent
  }]
};

export default schema;
