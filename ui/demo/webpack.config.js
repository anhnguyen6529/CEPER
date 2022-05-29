const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
    mode: 'production',
    entry: './src/index.js', 
    output: {
      path: path.join(__dirname, "/build"),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/, 
          exclude: /node_modules/, 
          use: ["babel-loader"]
        },
        {
          test: /\.css$/, 
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ]
    },
    resolve: {
      modules: ['src', 'node_modules'], // folder đối tượng
      extensions: ['.js', '.json'] // file đối tượng
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Caching',
        template: "./public/index.html"
      }),
    ],
  }