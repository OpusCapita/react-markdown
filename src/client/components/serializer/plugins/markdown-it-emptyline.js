'use strict';


module.exports = function emptyline_plugin(md) {
  function empty_line(state, startLine, endLine, silent) {
    let currLine = startLine;
    if (state.bMarks[currLine] === state.eMarks[currLine]) {
      while (state.bMarks[currLine] === state.eMarks[currLine]) {
        currLine++;
      }

      let lineCount = currLine - startLine;

      const token = new state.Token('empty', 'empty', 0);
      token.level = state.level;
      token.meta  = { length: lineCount };
      state.tokens.push(token);
      state.line = currLine;

      // console.log('startLine:', startLine, ',length:', lineCount);

      return true;
    }

    return false;
  }

  md.block.ruler.before('code', 'empty_line', empty_line, { alt: [ 'paragraph', 'reference' ] });
};
