import {
  hasBoldMarkdown,
  wrapBoldMarkdown,
  unwrapBoldMarkdown,
  hasItalicMarkdown,
  wrapItalicMarkdown,
  unwrapItalicMarkdown,
  hasStrikethroughMarkdown,
  wrapStrikethroughMarkdown,
  unwrapStrikethroughMarkdown,
  hasUnorderedListMarkdown,
  hasOrderedListMarkdown,
  unwrapOrderedListMarkdown,
  unwrapUnorderedListMarkdown,
  getCurrentLine,
} from './transforms';

const unorderedPref = /^ *[\+\-\*] /m;
const orderedPref = /^ *[0-9]+\. /m;
const orderedPrefDiv = /^( *)([0-9]+)(?:\. )/m;

/**
 * Add line break to the end of this line
 *
 * @param {object} state - Slate's state
 * @param {string} listType - current list's type (ordered or unordered)
 */
function addLineBreak(state, listType) {
  const regular = listType === 'ordered' ? orderedPref : unorderedPref;
  const unwrapper = listType === 'ordered' ? unwrapOrderedListMarkdown : unwrapUnorderedListMarkdown;
  const currentLine = getCurrentLine(state);
  let res = regular.exec(currentLine);
  let pref = res ? res[0] : '';
  if (currentLine === pref) {
    // unwrap current empty line and add line break
    return unwrapper(state).transform().insertText(`\n`).focus().apply();
  } else {
    if (listType === 'ordered') {
      res = orderedPrefDiv.exec(currentLine);
      pref = res ? `${res[1]}${parseInt(res[2]) + 1}. ` : pref;
    }
    // add line break and list prefix
    return state.transform().insertText(`\n${pref}`).focus().apply();
  }
}

/**
 * Create new list item block, when the cursor move to a next line
 */
const splitListBlock = (event, data, state) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    event.stopPropagation();
    if (hasUnorderedListMarkdown(state)) {
      return addLineBreak(state, 'unordered');
    } else if (hasOrderedListMarkdown(state)) {
      return addLineBreak(state, 'ordered');
    }

    return state.transform().insertText(`\n`).focus().apply();
  }

  return undefined;
};

/**
 * Key press handler
 *
 * @param event
 * @param data
 * @param state
 * @returns {object||undefined} - state when it has been changed or undefined in other cases
 */
export default (event, data, state) => {
  const result = splitListBlock(event, data, state);

  if (result) {
    return result;
  }
  // is ctrl
  if (data.isMod) {
    if (data.key === 'b') {
      if (hasBoldMarkdown(state)) {
        return unwrapBoldMarkdown(state);
      } else {
        return wrapBoldMarkdown(state);
      }
    } else if (data.key === 'i') {
      if (hasItalicMarkdown(state)) {
        return unwrapItalicMarkdown(state);
      } else {
        return wrapItalicMarkdown(state);
      }
    } else if (data.key === 's') {
      event.preventDefault();
      if (hasStrikethroughMarkdown(state)) {
        return unwrapStrikethroughMarkdown(state);
      } else {
        return wrapStrikethroughMarkdown(state);
      }
    }
  }

  return undefined;
};
