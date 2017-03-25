const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;

const plugins = [
  new CircularDependencyPlugin({
    exclude: /node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),
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
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }],
      },
    ],
  },
  plugins,
};
