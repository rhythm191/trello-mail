const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
  const setting = {
    entry: 'script.ts',
    output: {
      path: path.resolve(__dirname, './build/'),
      publicPath: '../build/',
      filename: 'script.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.ts$/,
          use: 'ts-loader'
        }
      ]
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['*', '.js', '.ts', '.json']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      contentBase: path.join(__dirname, 'public'),
      overlay: true,
      watchContentBase: true
    },
    performance: {
      hints: false
    }
  };

  return setting;
};
