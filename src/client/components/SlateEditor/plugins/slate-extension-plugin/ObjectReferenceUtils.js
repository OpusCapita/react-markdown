import { Raw } from 'slate';

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
  return state.transform().moveOffsetsTo(newOffset).wrapText(insertedText, '').moveOffsetsTo(state.endOffset + insertedText.length).focus().apply();
};


export const addObjectReference = (text, extension, state) => {
  if (text === '') {
    return state
  }
  return state.transform().insertText(text).extend(0 - text.length).wrapInline({
    type: 'objectReference',
    data: { extension }
  }).collapseToEnd().focus().apply();
};
export const removeObjectReference = (node, state) => {
  return state.transform().removeNodeByKey(node.key).focus().apply();
};
export const updateObjectReferenceText = (text, extension, node, state) => {
  if (text === '') {
    return removeObjectReference(node, state)
  }
  return state.transform().removeNodeByKey(node.key).insertText(text).extend(0 - text.length).wrapInline({
    type: 'objectReference',
    data: { extension }
  }).collapseToEnd().focus().apply();
};
