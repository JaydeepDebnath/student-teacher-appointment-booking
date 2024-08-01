import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  entry: './src/main.jsx',

  // Output configuration
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
    clean: true,
  },

  // Webpack Dev Server configuration
  devServer: {
    contentBase: path.resolve('dist'),
    compress: true,
    port: 3000,
    historyApiFallback: true, // Ensures client-side routing works correctly
  },

  // Module rules for handling different file types
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Matches .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Transpiles modern JavaScript and JSX
          },
        },
      },
      {
        test: /\.css$/, // Matches .css files
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // Extracts CSS into separate files
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Matches image files
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/images/',
            },
          },
        ],
      },
    ],
  },

  // Plugins for additional functionality
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for generating HTML file
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css', // Output CSS file
    }),
  ],

  // Resolve file extensions
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions without needing to specify them
  },
});

