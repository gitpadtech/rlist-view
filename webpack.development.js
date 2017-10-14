/**
 * React Modal Box
 */
var path = require("path");

module.exports = {
  entry: "./examples/scripts/index.js",
  output: {
    path: path.join(__dirname, "./examples/"),
    filename: "modal.js"
  },
  module: {
    loaders: [
      { test: /.jsx?$/,  loader: 'babel-loader',  exclude: /node_modules/,  query: {presets: ['es2015', 'react']}},
      { test: /\.css$/, loader: "style!css" }
    ]
  }
};