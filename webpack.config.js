const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/server/index.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist-back'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
};
