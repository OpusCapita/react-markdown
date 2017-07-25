// Paragraph

'use strict';

/**
 * This module creates one paragraph for each line with text
 *
 * @param md
 */

module.exports = function paragraph_line_plugin(md) {
  function paragraph_line(state, startLine/*, endLine*/) {
    let content, terminate, i, l, token, oldParentType,
      nextLine = startLine + 1,
      terminatorRules = state.md.block.ruler.getRules('paragraph'),
      endLine = state.lineMax;

    oldParentType = state.parentType;
    state.parentType = 'paragraph';

    content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

    state.line = nextLine;

    token          = state.push('paragraph_open', 'p', 1);
    token.map      = [ startLine, state.line ];

    token          = state.push('inline', '', 0);
    token.content  = content;
    token.map      = [ startLine, state.line ];
    token.children = [];

    token          = state.push('paragraph_close', 'p', -1);

    state.parentType = oldParentType;

    return true;
  }

  md.block.ruler.before('lheading', 'paragraph_line', paragraph_line, { alt: [ 'paragraph', 'reference' ] });
  // md.block.ruler.before('paragraph', 'paragraph_line', paragraph_line, { alt: [ 'paragraph', 'reference' ] });
};
