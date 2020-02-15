const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

module.exports = (env, argv) => {
  const IS_PRODUCTION = argv.mode === 'production';

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
      extensions: ['*', '.js', '.json']
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
    },
    optimization: {
      minimizer: []
    }
  };

  if (IS_PRODUCTION) {
    setting.optimization.minimizer.push(
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      })
    );
  }

  return setting;
};
