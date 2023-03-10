// eslint-disable-next-line no-unused-vars
const { WebpackOptionsNormalized } = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const DotenvWebpack = require('dotenv-webpack')
// const webpack = require('webpack')
// webpack.optimize

/**
 *
 * @param {WebpackOptionsNormalized} options
 * @returns {WebpackOptionsNormalized}
 */
const useWebpacktions = (options) => options

const { JKENV } = process.env
const envConfigPath = {
  prod: path.resolve(__dirname, './.env.prod'),
  dev: path.resolve(__dirname, './.env.dev'),
  other: path.resolve(__dirname, './.env'),
}
module.exports = useWebpacktions({
  mode: JKENV === 'prod' ? 'production' : 'development',
  entry: JKENV === 'test' ? './test/index.js' : './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: '[name].[fullhash].js',
    filename: '[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/',
    clean: {
      keep: /upload|package\.json/,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.cjs', '.js', '.json'],
  },
  module: {},
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  plugins: [
    new DotenvWebpack({
      path: Object.hasOwn(envConfigPath, JKENV)
        ? envConfigPath[JKENV]
        : envConfigPath.other,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    emitOnErrors: true,
  },
})
