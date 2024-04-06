const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const path = require('path');
const webpack = require('webpack'); // Import webpack

module.exports = override(
  addWebpackAlias({
    // 'http': require.resolve('stream-browserify'),
    // 'https': require.resolve('https-browserify'),
    'stream': require.resolve('stream-browserify'),
    'path': require.resolve('path-browserify'),
    'os': require.resolve('os-browserify/browser'),
    'crypto': require.resolve('crypto-browserify'),
  }),
  // Define process.env for the browser
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: 'process/browser', // Use the process/browser as a polyfill for the process object
    }),
  ),
);