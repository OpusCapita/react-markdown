'use strict';


module.exports = function emptyline_plugin(md) {
  function empty_line(state, startLine, endLine, silent) {
    let currLine = startLine;
    if (state.bMarks[currLine] === state.eMarks[currLine]) {
      while (state.bMarks[currLine] === state.eMarks[currLine] && currLine < endLine) {
        currLine++;
      }

      let lineCount = currLine - startLine;
      state.line = currLine;

      const token = new state.Token('empty', 'empty', 0);
      token.level = state.level;
      token.meta  = { length: lineCount };
      token.map = [ startLine, state.line ];
      state.tokens.push(token);

      return true;
    }

    return false;
  }

  md.block.ruler.before('table', 'empty_line', empty_line, { alt: [ 'paragraph', 'reference' ] });
};
