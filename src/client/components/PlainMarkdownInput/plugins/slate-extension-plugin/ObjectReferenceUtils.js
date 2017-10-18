export const addSpecialCharacter = (specialCharacter, state) => {
  let text = state.startBlock.text;
  let newOffset = 0;
  let insertedText = '';
  if ((text.length === state.endOffset) && (text[text.length - 1] !== ' ')) {
    insertedText = ` ${specialCharacter}`;
    newOffset = text.length;
  } else {
    insertedText = specialCharacter;
    newOffset = text.substring(0, state.startOffset).lastIndexOf(' ') + 1;
  }
  const change = state.change();
  change.moveOffsetsTo(newOffset).wrapText(insertedText, '').
  moveOffsetsTo(state.endOffset + insertedText.length).focus();
  return change.state;
};
