const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const paths = require('./paths');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: paths.build,
    open: true,
    compress: true,
    hot: true,
    before(app, server, compiler) {
      const watchFiles = ['.html', '.hbs'];

      compiler.plugin('done', () => {
        const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

        if (
          this.hot
          && changedFiles.some((filePath) => watchFiles.includes(path.parse(filePath).ext))
        ) {
          server.sockWrite(server.sockets, 'content-changed');
        }
      });
    },
    port: 3030,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
