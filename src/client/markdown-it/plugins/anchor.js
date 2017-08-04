// Process footnotes
//
'use strict';

module.exports = function(md) {
  let parseLinkLabel = md.helpers.parseLinkLabel,
    isSpace = md.utils.isSpace;

  // Process footnote block definition
  function anchor_def(state, startLine, endLine, silent) {
    let oldBMark, oldTShift, oldSCount, oldParentType, pos, label, token,
      initial, offset, ch, posAfterColon,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

    // line should be at least 5 chars - "[^x]:"
    if (start + 4 > max) { return false; }

    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }

    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) { return false; }
      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
        break;
      }
    }

    if (pos === start + 2) { return false; } // no empty footnote labels
    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A /* : */) { return false; }
    pos++;

    if (!state.env.footnotes) { state.env.footnotes = {}; }
    if (!state.env.footnotes.refs) { state.env.footnotes.refs = {}; }
    label = state.src.slice(start + 2, pos - 2);
    state.env.footnotes.refs[':' + label] = -1;

    token       = new state.Token('anchor_open', 'anchor', 1);
    token.meta  = { label: label };
    token.level = state.level++;
    token.map = [ startLine, startLine + 1 ];
    state.tokens.push(token);

    oldBMark = state.bMarks[startLine];
    oldTShift = state.tShift[startLine];
    oldSCount = state.sCount[startLine];
    oldParentType = state.parentType;

    posAfterColon = pos;
    initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

    while (pos < max) {
      ch = state.src.charCodeAt(pos);

      if (isSpace(ch)) {
        offset++;
      } else {
        break;
      }

      pos++;
    }

    state.tShift[startLine] = pos - posAfterColon;
    state.sCount[startLine] = offset - initial;

    state.bMarks[startLine] = posAfterColon;
    state.blkIndent += 4;
    state.sCount[startLine] += state.blkIndent;

    state.md.block.tokenize(state, startLine, endLine, true);

    state.parentType = oldParentType;
    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;

    token = new state.Token('anchor_close', 'anchor', -1);
    token.level = --state.level;
    state.tokens.push(token); // eslint-disable-line

    return true;
  }

  md.block.ruler.before('reference', 'anchor_def', anchor_def, { alt: ['paragraph', 'reference'] });
};
