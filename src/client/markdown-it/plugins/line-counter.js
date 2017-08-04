'use strict';

/**
 * This module creates one empty block for each empty line
 *
 * @param md
 */

module.exports = function lineCounterPlugin(md) {
  function lineCounter(state, startLine, endLine) {
    if (!state.isCalculatedLine) {
      let token = state.push('line_count', 'lc', 1);
      token.startLine = startLine;
      token.endLine = endLine;
      state.isCalculatedLine = true; // eslint-disable-line
      return true;
    }

    return false;
  }

  md.block.ruler.before('table', 'line_counter', lineCounter, { alt: ['paragraph', 'reference'] });
};
