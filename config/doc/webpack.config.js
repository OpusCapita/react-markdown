const path = require('path');
const webpack = require('webpack');

const PACKAGE_VERSION = require('../../package.json').version;
const PACKAGE_NAME = require('../../package.json').name;
const {HOST, PORT} = require('../../.env');
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  entry: path.resolve(__dirname, '../../www/index-page.js'),
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, '../../lib'),
    filename: `index.js`,
    library: `${PACKAGE_NAME}`,
    libraryTarget: 'umd'
  },
  bail: true,
  plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true
        },
        comments: false
      })
  ],
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
              config: path.resolve(__dirname, '../postcss.config.js')
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
              config: path.resolve(__dirname, '../postcss.config.js')
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
          path.join(__dirname, '../../src'),
          path.join(__dirname, '../../www')
        ]
      }
    ]
  }
};
