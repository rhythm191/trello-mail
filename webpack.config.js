var webpack = require('webpack');

webpack_config = {
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
  devtool: 'inline-source-map',
  plugins: []
};

if (process.env.NODE_ENV === 'production') {
  webpack_config.devtool = false;
  webpack_config.plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = webpack_config
