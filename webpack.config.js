const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

module.exports = (env, argv) => {
  const IS_PRODUCTION = argv.mode === 'production';

  const setting = {
    entry: 'script.js',
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
        }
      ]
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['*', '.js', '.vue', '.json']
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
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
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
