const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const build = require('./webpack.build.config');

module.exports = merge(build, {
  output: {
    path: path.resolve(__dirname, '../lib/components'),
    filename: `grails-plugin-markdown-input.js`,
    library: `MarkdownInput`,
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        // don't show unreachable variables etc
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  ]
});
