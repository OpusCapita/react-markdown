'use strict';

/**
 * This module creates one empty block for each empty line
 *
 * @param md
 */

module.exports = function emptyline_plugin(md) {
  function empty_line(state, startLine, endLine, silent) {
    let currLine = startLine;
    // if (state.bMarks[currLine] === state.eMarks[currLine]) {
    const lineValue = state.src.substring(state.bMarks[startLine], state.eMarks[startLine]);
    if (state.bMarks[startLine] === state.eMarks[startLine]) {
    // ||  lineValue.trim() === '') {
      // while (state.bMarks[currLine] === state.eMarks[currLine] && currLine < endLine) {
      //   currLine++;
      // }

      // let lineCount = currLine - startLine;
      // state.line = currLine;
      state.line++;

      // const token = new state.Token('empty', 'empty', 0);
      // token.level = state.level;
      // // token.meta  = { length: lineCount };
      // token.meta  = { length: 1 };
      // token.map = [ startLine, state.line ];
      // state.tokens.push(token);


      let token          = state.push('paragraph_open', 'p', 1);
      token.map      = [ startLine, state.line ];

      token          = state.push('inline', '', 0);
      // token.content  = lineValue;
      token.content  = '';
      token.map      = [ startLine, state.line ];
      token.children = [];

      token          = state.push('paragraph_close', 'p', -1);


      return true;
    }

    return false;
  }

  md.block.ruler.before('table', 'empty_line', empty_line, { alt: [ 'paragraph', 'reference' ] });
};
