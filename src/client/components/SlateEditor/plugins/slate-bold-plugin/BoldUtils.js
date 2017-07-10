export const hasMark = state => state.marks.some(mark => mark.type === 'bold');

export const boldMark = state => state
  .transform()
  .toggleMark('bold')
  .focus()
  .apply();
