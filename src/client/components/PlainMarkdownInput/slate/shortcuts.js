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

export default (event, data, state) => {
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
