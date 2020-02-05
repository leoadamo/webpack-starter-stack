const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const paths = require('./paths');

(async () => {
  await imagemin([`${paths.src}/images/*.{jpg,png}`], {
    destination: `${paths.src}/images`,
    plugins: [imageminWebp({ quality: 30 })],
  });
})();

module.exports = {
  entry: [`${paths.src}/index.js`],

  output: {
    path: paths.build,
    filename: '[name].bundle.js',
    publicPath: '',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Webpack Starter Stack',
      favicon: `${paths.src}/images/favicon.ico`,
      template: `${paths.src}/template.hbs`,
      filename: 'index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },

      {
        test: /\.(styl|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'stylus-loader', options: { sourceMap: true } },
        ],
      },

      {
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader',
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'html-loader',
            options: {
              attrs: [
                'img:src',
                'source:srcset',
              ],
            },
          },
        ],
      },

      {
        test: /\.(jpe?g|png|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              esModule: false,
              context: 'src',
              publicPath: '',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 60,
              },
              pngquant: {
                quality: [0.60, 0.70],
                speed: 4,
              },
            },
          },
        ],
      },

      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[path][name].ext',
          context: 'src',
          publicPath: '../',
        },
      },
    ],
  },
};
