const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const env = process.env.NODE_ENV;
const libraryName = process.env.npm_package_name;
const plugins = [];
let outputFile = `${libraryName}.js`;
let devtool;

if (env === 'dev') {
  devtool = 'source-map';
}

if (env === 'production') {
  plugins.push(
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        comments: false,
      },
      compressor: {
        warnings: false,
      },
    }));
  outputFile = `${libraryName}.min.js`;
}

module.exports = {
  devtool,
  plugins,
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/lib/`,
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
};
