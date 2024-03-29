const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
  context: ROOT,

  entry: {
    main: './main.ts'
  },

  output: {
    filename: 'blinx.js',
    path: DESTINATION
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [ROOT, 'node_modules'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: 'tsconfig.app.json'
      })
    ]
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.app.json'
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  },

  devtool: 'source-map',
  devServer: {},

  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd()
    })
  ]
};
