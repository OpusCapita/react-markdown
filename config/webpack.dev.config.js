const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  entry: [
    path.resolve(__dirname, '../www/index-page.js')
  ],
  output: {
    publicPath: `/`,
    filename: 'index.js',
    library: 'MarkdownInput',
    libraryTarget: 'umd'
  },
  devtool: 'inline-source-map',
  watch: true
});
