export const hasBlock = state => state.blocks.some(block => block.type === 'blockquote');

const DEFAULT_NODE = 'paragraph';

export const unwrapBlock = state => state.
  transform().
  setBlock(DEFAULT_NODE).
  focus().
  apply();


export const wrapBlock = state => state.
  transform().
  setBlock('blockquote').
  focus().
  apply();
