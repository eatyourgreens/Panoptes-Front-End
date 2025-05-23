'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

var config = {
  mode: 'development',
  devServer: {
    allowedHosts: [
      '.zooniverse.org'
    ],
    historyApiFallback: true,
    client: {
      overlay: false,
      progress: true
    },
    server: 'https',
    port: 3735
  },
  devtool: 'cheap-module-source-map',
  entry: [
    path.join(__dirname, 'app/main.cjsx')
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    // Image assets will be placed in the '/lab' subpath.
    // This is due to how the www.zooniverse.org domain maps PFE and FEM to
    // different subpaths; the root '/' path isn't set to serve PFE code, let
    // alone PFE-related image assets.
    // See https://github.com/zooniverse/static/blob/632be4f/nginx-pfe-redirects.conf
    // The /lab subfolder was chosen since bundled image assets are primarily
    // used ONLY by the Pages Editor system.
    // See https://github.com/zooniverse/Panoptes-Front-End/issues/7295
    assetModuleFilename: 'lab/[hash][ext][query]',
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      'HEAD_COMMIT': null,
      'NODE_ENV': 'development',
      'PANOPTES_API_APPLICATION': null,
      'PANOPTES_API_HOST': null,
      'STAT_HOST': null,
      'SUGAR_HOST': null,
      'TALK_HOST': null
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' }
      ]
    }),
    new HtmlWebpackPlugin({
      useBasePath: false,
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html'
    }),
    new DashboardPlugin({ port: 3736 }) // Change this here and in the package.json start script if needed.
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.cjsx', '.coffee', '.styl', '.css'],
    modules: ['.', 'node_modules'],
    fallback: {
      fs: false,
      // for markdown-it plugins
      path: require.resolve("path-browserify"),
      util: require.resolve("util"),
      url: require.resolve("url"),
      process: false,
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: { cacheDirectory: true }
      }, {
        loader: 'coffee-loader'
      }, {
        loader: path.resolve('./webpack/cjsx-loader.js')
      }]
    }, {
      test: /\.coffee$/,
      use: [{
        loader: 'babel-loader',
        options: { cacheDirectory: true }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.styl$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'stylus-loader'
      }]
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      type: 'asset/resource'
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/]
  }
};

module.exports = config;
