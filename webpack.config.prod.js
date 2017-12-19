/**
 * Webpack configuration for handling the applicatino's source code
 * in production mode (standard + minify)
 */
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

console.log('plugin')

var sharedConfig = require('./webpack.config.shared');

const config = {
  module: sharedConfig.module,
  node: sharedConfig.node,
  plugins: sharedConfig.plugins
    .concat(
      new webpack.optimize.UglifyJsPlugin()
    )
    .concat(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }))
};

module.exports = config;