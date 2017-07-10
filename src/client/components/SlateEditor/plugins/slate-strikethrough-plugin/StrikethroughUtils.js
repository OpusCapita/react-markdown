export const hasMark = state => state.marks.some(mark => mark.type === 'strikethrough');

export const strikethroughMark = state => state.
  transform().
  toggleMark('strikethrough').
  focus().
  apply();
