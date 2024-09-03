const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const dotenv = require('dotenv');
const APP_VARIABLES_PREFIX = 'APP_';

module.exports = (env, argv) => {
  const MODE = argv.mode || 'production';
  dotenv.config({ path: MODE === 'production' ? '.env' : '.env.dev' });

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    devtool: MODE === 'production' ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    mode: MODE,
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: argv.port || 3000,
      hot: true,
    },
    optimization: {
      minimize: MODE === 'production',
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
      usedExports: MODE === 'development',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin({ filename: 'styles.css' }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(
          Object.fromEntries(
            Object.entries(process.env).filter(([key]) =>
              key.startsWith(APP_VARIABLES_PREFIX),
            ),
          ),
        ),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'public',
              },
            },
          ],
        },
      ],
    },
  };
};
