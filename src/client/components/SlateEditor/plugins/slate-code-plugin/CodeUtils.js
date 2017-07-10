export const hasMark = state => state.marks.some(mark => mark.type === 'code');

export const codeMark = state => state
  .transform()
  .toggleMark('code')
  .focus()
  .apply();
