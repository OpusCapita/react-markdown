'use strict';

/**
 * This module creates one empty block for each empty line
 *
 * @param md
 */

module.exports = function line_counter_plugin(md) {
  function line_counter(state, startLine, endLine) {
    if (!state.isCalculatedLine) {
      let token = state.push('line_count', 'lc', 1);
      token.startLine = startLine;
      token.endLine = endLine;
      state.isCalculatedLine = true;
      return true;
    }

    return false;
  }

  md.block.ruler.before('table', 'line_counter', line_counter, { alt: [ 'paragraph', 'reference' ] });
};
