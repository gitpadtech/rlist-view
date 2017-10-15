/**
 * React Modal Box
 */
var path = require("path");

module.exports = {
  entry: "./examples/scripts/index",
  output: {
    path: path.join(__dirname, "./examples/"),
    filename: "dist.js"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      { test: /.jsx?$/,  loader: 'babel-loader',  exclude: /node_modules/,  query: {presets: ['es2015', 'react']}},
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
};