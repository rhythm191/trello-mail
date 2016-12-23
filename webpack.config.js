var webpack = require('webpack');

module.exports = {
  entry: 'script.js',
  output: {
    path: __dirname + '/build/',
    publicPath: '../build/',
    filename: 'script.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query:{
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
};
