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
} from './transforms';
import { autoScrollToTop } from '../Utils';

/**
 * Create new list item block, when the cursor move to a next line
 */
const enterKeyDownHandler = (event) => {
  if (event.keyCode === 13) {
    autoScrollToTop();
  }

  return undefined;
};

export default (event, data, state) => {
  const result = enterKeyDownHandler(event);

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
