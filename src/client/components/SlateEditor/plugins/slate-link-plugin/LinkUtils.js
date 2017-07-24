export const getLink = (state) => {
  return state.inlines.asImmutable().filter(inline => inline.type === 'link').first()
};
export const getSelectedText = state => {
  const { selection, document } = state;
  return document.getFragmentAtRange(selection).text;
};

export const unlink = state =>
  state.
    transform().
    unwrapInline('link').
    focus().
    apply();

export const updateLink = (state, { href, text }) => {
  const { selection } = state;
  const { startOffset, endOffset } = selection;

  const transform = state.transform();

  if (startOffset === endOffset) {
    const link = state.inlines.asImmutable().filter(inline => inline.type === 'link');
    if (link) {
      // change exists link
      transform.removeNodeByKey(link.key)
    }
  } else {
    // change selected area
    transform.delete();
  }
  return transform.insertText(text).
    extend(0 - text.length).
    wrapInline({
      type: 'link',
      data: { href }
    }).collapseToEnd().
    focus().
    apply()
};
