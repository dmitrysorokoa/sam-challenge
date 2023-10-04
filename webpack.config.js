const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './index.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
  plugins: [
    // new WebpackShellPluginNext({
    //   onBuildEnd: {
    //     scripts: ['npm run run:dev'],
    //     blocking: true,
    //     parallel: false
    //   }
    // }),
    // NODE_ENV === 'development' &&
    //   new HookShellScriptPlugin({
    //     afterEmit: ['npm run run:dev'],
    //   }),
  ],
  externals: [nodeExternals()],
  watch: NODE_ENV === 'development',
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
};
