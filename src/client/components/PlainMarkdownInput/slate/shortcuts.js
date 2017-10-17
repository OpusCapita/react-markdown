import {
  hasAccent,
  unwrapAccent,
  wrapAccent,
  // unwrapBoldMarkdown,
  // wrapBoldMarkdown,
  // unwrapItalicMarkdown,
  // wrapItalicMarkdown,
  // unwrapStrikethroughMarkdown,
  // wrapStrikethroughMarkdown,
} from './transforms';

const ACCENTS = {
  b: 'bold',
  i: 'italic',
  s: 'strikethrough'
};

// export default (event, data, change) => {
export default (event, data, state) => {
  // is ctrl
  if (data.isMod) {
    // const { state } = change;
    // if (data.key === 'b') {
    //   if (hasAccent(state, 'bold')) {
    //     return unwrapBoldMarkdown(change);
    //   } else {
    //     return wrapBoldMarkdown(change);
    //   }
    // } else if (data.key === 'i') {
    //   if (hasAccent(state, 'italic')) {
    //     return unwrapItalicMarkdown(change);
    //   } else {
    //     return wrapItalicMarkdown(change);
    //   }
    // } else if (data.key === 's') {
    //   event.preventDefault();
    //   if (hasAccent(state, 'strikethrough')) {
    //     return unwrapStrikethroughMarkdown(change);
    //   } else {
    //     return wrapStrikethroughMarkdown(change);
    //   }
    // }

    if (ACCENTS[data.key]) {
      const accent = ACCENTS[data.key];
      if (hasAccent(state, accent)) {
        return unwrapAccent(state, accent);
      } else {
        return wrapAccent(state, accent);
      }
    }

    // if (data.key === 'b') {
    //   if (hasAccent(state, 'bold')) {
    //     return unwrapBoldMarkdown(change);
    //   } else {
    //     return wrapBoldMarkdown(change);
    //   }
    // } else if (data.key === 'i') {
    //   if (hasAccent(state, 'italic')) {
    //     return unwrapItalicMarkdown(change);
    //   } else {
    //     return wrapItalicMarkdown(change);
    //   }
    // } else if (data.key === 's') {
    //   event.preventDefault();
    //   if (hasAccent(state, 'strikethrough')) {
    //     return unwrapStrikethroughMarkdown(change);
    //   } else {
    //     return wrapStrikethroughMarkdown(change);
    //   }
    // }
  }

  return undefined;
};
