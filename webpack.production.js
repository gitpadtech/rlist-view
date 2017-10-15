/**
 * React Modal Box
 */
var path    = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./src/index",
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "index.js",
    library: ["react-modal-box"],
    libraryTarget: "umd",
    publicPath: "/dist/"
  },
  resolve: {
    modules: ['node_modules', './src'],
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /.jsx?$/,  loader: 'babel-loader',  exclude: /node_modules/,  query: {presets: ['es2015', 'react']}},
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};