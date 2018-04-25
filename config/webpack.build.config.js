const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  entry: [
    path.resolve(__dirname, '../src/client/components/MarkdownInput')
  ],
  output: {
    path: path.resolve(__dirname, '../lib/components'),
    filename: `MarkdownInput.js`,
    library: `MarkdownInput`,
    libraryTarget: 'umd'
  }
});
