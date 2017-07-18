'use strict';

const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const PACKAGE_VERSION = require('../package.json').version;
const PACKAGE_NAME = require('../package.json').name;
const HOST = require('../.env').HOST;
const PORT = require('../.env').PORT;
const NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION_MODE = NODE_ENV === 'production';
const IS_LINK_MODE = NODE_ENV === 'link';
const WEBPACK_BUNDLE_ANALYZE = process.env.WEBPACK_BUNDLE_ANALYZE;

let plugins = [
    new ProgressBarPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.HOST': JSON.stringify(HOST),
      'process.env.PORT': JSON.stringify(PORT),
      'process.env.NODE_ENV': `"${NODE_ENV}"`
    })
];

if(IS_LINK_MODE) {
  plugins.push(new WriteFilePlugin());
}

if(IS_PRODUCTION_MODE) {
  let uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true
    },
    comments: false
  });

  plugins.push(uglifyPlugin);
}

if(WEBPACK_BUNDLE_ANALYZE && IS_PRODUCTION_MODE) {
  let bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info'
  });

  plugins.push(bundleAnalyzerPlugin);
}

module.exports = {
  entry: [
    'babel-polyfill',
    (IS_PRODUCTION_MODE || IS_LINK_MODE) ?
      path.resolve(__dirname, '../src/client/index.js') :
      path.resolve(__dirname, '../www/index-page.js')
  ],
  context: path.resolve(__dirname),
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../lib'),
    filename: `index.js`,
    library: `${PACKAGE_NAME}`,
    libraryTarget: 'umd'
  },
  devtool: IS_PRODUCTION_MODE ? false : 'inline-source-map',
  watch: !IS_PRODUCTION_MODE,
  bail: true,
  plugins: plugins,
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.json', '.js']
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test   : /\.(png|jpg|jpeg|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use : ['file-loader']
      },
      {
        test: /\.md$/,
        use: [{
          loader: 'raw-loader'
        }]
      },
      {
        test: /\.(css|less)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              localIdentName: `[name]__[local]__${PACKAGE_VERSION}_[hash:base64:3]`,
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: path.resolve(__dirname, './postcss.config.js')
            }
          },
          { loader: 'less-loader', options: { sourceMap: true } }
        ],
        include: /\.module\.(css|less)$/
      },
      {
        test: /\.(css|less)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              config: path.resolve(__dirname, './postcss.config.js')
            }
          },
          { loader: 'less-loader', options: { sourceMap: true } }
        ],
        exclude: /\.module\.(css|less)$/
      },
      {
        test: /.js?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: ['transform-decorators-legacy']
          }
        }],
        include: [
          path.resolve(__dirname, '../src')
        ]
      }
    ]
  }
};
