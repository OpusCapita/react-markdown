export const hasMark = state => state.marks.some(mark => mark.type === 'italic');

export const italicMark = state => state.
  transform().
  toggleMark('italic').
  focus().
  apply();
