const webpack = require('webpack');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const DedupePlugin = webpack.optimize.DedupePlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;

const plugins = [
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),
  new DedupePlugin(),
  new UglifyJsPlugin({
    minimize: true,
    output: {
      comments: false,
    },
    compressor: {
      warnings: false,
    },
  }),
  new OccurrenceOrderPlugin(),
];

const libraryName = process.env.npm_package_name;
const outputFile = `${libraryName}.js`;

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: false,
  },
  module: {
    loaders: [
      {
        exclude: [/node_modules/],
        loader: 'babel',
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    root: path.resolve('./src'),
    extensions: ['', '.js', '!test.js'],
  },
  plugins,
};
