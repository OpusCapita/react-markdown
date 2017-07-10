export const hasBlock = (state, type) => state.blocks.some(block => block.type === type);

const DEFAULT_NODE = 'paragraph';

export const unwrapBlock = (state, type) => state.
  transform().
  setBlock(DEFAULT_NODE).
  focus().
  apply();


export const wrapBlock = (state, type) => state.
  transform().
  setBlock(type).
  focus().
  apply();
