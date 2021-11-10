const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const TerserWebpackPlugin = require('terser-webpack-plugin');

// @ts-ignore
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  stats: { children: false, warnings: false },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            // 是否注释掉console
            drop_console: false,
            dead_code: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true,
        },
      },
    },
  },
});

module.exports = webpackConfig;
