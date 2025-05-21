const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../../app/index.js'),
  output: {
    path: path.resolve(__dirname, '../../../../dist/admin-web2'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx' ],
    alias: {
      '@': path.resolve(__dirname, '../../app'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env","@tailwindcss/postcss"
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'),
      inject:'body'
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../../public'),
    },
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  },
};
