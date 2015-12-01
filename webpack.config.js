var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    bg: "./app/ext/components/bg/background",
    interrupt: "./app/ext/components/interrupt/interrupt"
  },
  // Turn on sourcemaps
  devtool: 'source-map',

  // Add minification
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin()
  // ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js"
  }
};
