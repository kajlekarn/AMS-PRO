const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (config, options) => {
  const isProduction = options.configuration === 'production';

  // Instead of adding new rules, let's modify the existing CSS rule
  const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString().includes('.css'));
  
  if (cssRule) {
    cssRule.use = [
      isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: false
        }
      },
      'postcss-loader'
    ];
  }

  if (isProduction) {
    config.plugins.push(new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }));
  }

  return config;
};
