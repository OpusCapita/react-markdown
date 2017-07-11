// Process empty lines
//
'use strict';


module.exports = function emptyline_plugin(md) {
  function empty_line(state, startLine, endLine, silent) {
    if (state.bMarks[startLine] === state.eMarks[startLine]) {
      const token = new state.Token('empty', 'empty', 0);
      token.level = state.level;
      state.tokens.push(token);
      state.line = startLine + 1;

      return true;
    }

    return false;
  }

  md.block.ruler.before('code', 'empty_line', empty_line, { alt: [ 'paragraph', 'reference' ] });
};
