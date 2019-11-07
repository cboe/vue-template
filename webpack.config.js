'use strict';

const path = require('path'); // Cross platform path resolver
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Script tag injector
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); // Nicer CLI interface
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
const webpack = require('webpack');
const openInEditor = require('launch-editor-middleware');
const WebpackCleanPlugin = require('webpack-clean');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(env = {}, options = {}) {
  // Flags
  const isProduction = ((options.mode || process.env.NODE_ENV) === 'production') || false;
  const hasStyleguide = env.styleguide || false;
  const hasMessage = env.message || false;
  const hasWatcher = env.watch || false;
  const hotReload = !hasWatcher || !isProduction;
  const isProfileBuild = (options.profile && options.json) || false;
  const hasMonitorSnapshot = env.monitor || false;
  const hash = isProduction && !hasWatcher ? '.[hash]' : '';
  const chunkHash = isProduction && !hasWatcher ? '.[chunkhash]' : '';
  const contentHash = isProduction && !hasWatcher ? '.[contenthash]' : '';

  // Configuration
  const buildPath = path.resolve(__dirname, 'dist');
  const filePrefix = 'shop';
  const devPort = 8080;
  const assetsSubDirectory = 'assets/';
  const globalVariables = {
    'process.env': {
      NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'), // Needed by vendor scripts
      HAS_STYLEGUIDE: JSON.stringify(hasStyleguide),
      HAS_WATCHER: hasWatcher,
      BUILD_HASH: JSON.stringify(new Date().getTime()),
    },
  };

  const host = options.host !== 'localhost'
    ? options.host
    : '0.0.0.0'; // 0.0.0.0 is needed to allow remote access for testing
  const prefix = filePrefix ? `${filePrefix}.` : '';
  const include = [
    path.resolve(__dirname, 'app'),
    path.resolve(__dirname, 'test'),
  ];

  const themes = {
    'theme-01': path.resolve(__dirname, 'app/setup/scss/themes/theme-01.scss'),
    'theme-02': path.resolve(__dirname, 'app/setup/scss/themes/theme-02.scss'),
  };

  const clean = [
    ...Object.keys(themes).map(theme => `${assetsSubDirectory}js/${prefix}${theme}.js`), // TODO: does not work with hashes
    `${assetsSubDirectory}js/*.map`,
  ];

  if (!isProfileBuild && hasMessage) {
    const target = hasStyleguide
      ? 'Styleguide'
      : 'Production';

    // Print type of build (first value is log color)
    console.info('\x1b[36m%s\x1b[0m', '## Building for ' + target + ' ##');
  }

  function webpackStats() {
    const stats = {
      all: false,
      // List created files
      assets: true,
      // Sorting of stats info
      assetsSort: '!size',
      // Show errors
      errors: true,
      // Show build time
      timings: true,
      // Show warnings
      warnings: true,
    };

    if (hasWatcher) {
      return {
        ...stats,
        assets: false,
        warnings: false,
        errors: false,
        timings: false,
      };
    }

    return !isProfileBuild ? stats : undefined;
  }

  function plugins() {
    const pluginCollection = [
      new VueLoaderPlugin(),

      new webpack.DefinePlugin(globalVariables),

      new MiniCssExtractPlugin({
        filename: assetsSubDirectory + `css/${prefix}[name]${contentHash}.css`,
        ignoreOrder: true, // @see https://github.com/webpack-contrib/mini-css-extract-plugin#remove-order-warnings
      }),

      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'),
          ignore: ['.*']
        },
      ]),
    ];

    if (hasMonitorSnapshot) {
      // Create webpack monitor snapshot
      pluginCollection.push(new WebpackMonitor({
        capture: !hasStyleguide,
        target: '../stats/monitor.json',
        launch: hasMonitorSnapshot
      }));
    }

    if (isProduction) {
      if (hasWatcher) {
        pluginCollection.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: ['Your production build was updated.'],
          },
        }));
      } else {
        // Minify css output (was required because the default setup did not minify CSS from node_modules.
        pluginCollection.push(
          new OptimizeCssAssetsPlugin({
            canPrint: hasMessage
          })
        );

        if (hasMessage) {
          pluginCollection.push(
            // Cleans dist directory and removes specific unnecessary files
            new WebpackCleanPlugin(
              clean,
              { basePath: buildPath }),
          );
        }
      }

      // keep module.id stable when vender modules does not change
      pluginCollection.push(new webpack.HashedModuleIdsPlugin());

      // enable scope hoisting
      pluginCollection.push(new webpack.optimize.ModuleConcatenationPlugin());

      // Create a manifest file so the hashed file names can be used in twig templates.
      pluginCollection.push(new WebpackManifestPlugin({
        filter(options) {
          return !options.isAsset;
        }
      }));

      // Lint CSS styles. Don't use for production. It's too slow.
      pluginCollection.push(new StyleLintPlugin({
        context: 'app',
        failOnError: true,
        files: [
          '**/*.vue',
          '**/*.scss',
        ],
      }));
    } else { // Development
      // Create index.html for dev server
      pluginCollection.push(new HtmlWebpackPlugin({ // Script tag injection
        inject: true,
        template: 'index.html',
        chunksSortMode: 'dependency',
        excludeChunks: Object.keys(themes),
      }));

      pluginCollection.push(new webpack.NamedModulesPlugin()); // Hot Module Replacement

      if (!hasStyleguide) {
        pluginCollection.push(new webpack.HotModuleReplacementPlugin()); // Hot Module Replacement => vue-styleguidist applies this aswell, which caused problems with scss imports

        pluginCollection.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running on http://${host === '0.0.0.0' ? 'localhost' : host}:${devPort}.`],
          },
        }));
      }
    }

    return pluginCollection;
  }

  const baseConfig = {
    mode: isProduction ? 'production' : 'development',
    entry: {
      ...themes,
      app: [
        '@babel/polyfill',
        path.resolve(__dirname, 'app/main.js'),
      ],
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js', // Use 'vue.esm' when importing from 'vue'
        swiper$: 'swiper/dist/js/swiper.js', // Use builded code from swiper when importing from 'swiper'
        '@': path.join(__dirname, 'app'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include,
          options: {
            failOnError: isProduction && !hasWatcher,
            emitWarning: hasWatcher || !isProduction, // Keeps overlay from showing during development, because it's annoying
            cache: hasWatcher || !isProduction, // Improves linting performance
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            // extractCSS can not be used because of scss
            // cssSourceMap can not be used because of scss
            hotReload,
            // If you have problems debugging vue-files in devtools,
            // set this to false - it *may* help
            // https://vue-loader.vuejs.org/en/options.html#cachebusting
            cacheBusting: false, // TODO: shouldn't this be true?
            compilerOptions: { // @see https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options
              whitespace: 'condense',
            }
          },
        },
        {
          test: /\.scss$/,
          use: [
            hasStyleguide ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader', // Note: will also call postcss
              options: {
                importLoaders: 3,
                sourceMap: !isProduction || hasStyleguide,
              },
            },
            'postcss-loader', // See ./postcss.config.js for configuration.
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProduction || hasStyleguide,
              },
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  './app/setup/scss/_variables.scss',
                  './app/setup/scss/_config.scss',
                  './app/setup/scss/_functions.scss',
                  './app/setup/scss/_mixins.scss',
                  './app/setup/scss/_extends.scss',
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            hasStyleguide ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
          ],
        },
        {
          test: /\.styl$/,
          use: [
            hasStyleguide ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: !isProduction
              }
            },
            'postcss-loader', // See ./postcss.config.js for configuration.
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: !isProduction
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          include,
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: 'app/assets/',
                name: `[path]/[name]${hash}.[ext]`,
                outputPath: `${assetsSubDirectory}img/`,
              },
            },
            {
              loader: 'image-webpack-loader', // @see https://github.com/tcoopman/image-webpack-loader
              options: {
                svgo: {
                  plugins: [
                    //{ cleanupAttrs: false, },
                    //{ removeDoctype: false, },
                    //{ removeXMLProcInst: false, },
                    //{ removeComments: false, },
                    //{ removeMetadata: false, },
                    //{ removeTitle: false, },
                    //{ removeDesc: false, },
                    { removeUselessDefs: false },
                    //{ removeEditorsNSData: false, },
                    //{ removeEmptyAttrs: false, },
                    //{ removeHiddenElems: false, },
                    //{ removeEmptyText: false, },
                    //{ removeEmptyContainers: false, },
                    { removeViewBox: false, },
                    //{ cleanUpEnableBackground: true, },
                    //{ convertStyleToAttrs: true, },
                    //{ convertColors: true, },
                    //{ convertPathData: true, },
                    //{ convertTransform: true, },
                    //{ removeUnknownsAndDefaults: true, },
                    //{ removeNonInheritableGroupAttrs: true, },
                    //{ removeUselessStrokeAndFill: true, },
                    //{ removeUnusedNS: true, },
                    { cleanupIDs: false },
                    //{ cleanupNumericValues: false, },
                    //{ moveElemsAttrsToGroup: true, },
                    //{ moveGroupAttrsToElems: true, },
                    //{ collapseGroups: false, },
                    //{ removeRasterImages: false, },
                    //{ mergePaths: true, },
                    //{ convertShapeToPath: true, },
                    //{ sortAttrs: true, },
                    //{ transformsWithOnePath: false, },
                    //{ removeDimensions: true, }
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `${assetsSubDirectory}media/[name]${hash}.[ext]`,
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `${assetsSubDirectory}fonts/[name]${hash}.[ext]`,
          },
        },
        {
          test: /\.md$/,
          loader: [
            'vue-loader',
            {
              loader: 'vue-markdown-loader/lib/markdown-compiler',
              options: {
                raw: true
              }
            }
          ],
        },
      ],
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };

  const devConfig = {
    output: {
      path: buildPath,
      filename: '[name].js',
      publicPath: '/',
    },
    // Other methods may be faster. @see https://webpack.js.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
    devtool: 'eval-source-map',
    devServer: {
      clientLogLevel: 'error', // Removes ESLint warnings from console
      historyApiFallback: true, // Enables routing support
      host,
      port: devPort,
      hot: hotReload,
      compress: true,
      overlay: true,
      quiet: true, // Handled by FriendlyErrorsPlugin
      inline: true,
      progress: true,
      before(app) {
        if (!hasStyleguide) {
          console.clear();
        }

        app.use('/__open-in-editor', openInEditor()); // Adds 'open in editor' support for Vue Inspector
      },
    },
    plugins: plugins(),
  };

  const prodConfig = {
    watch: hasWatcher,
    output: {
      path: buildPath,
      filename: `${assetsSubDirectory}js/${prefix}[name]${chunkHash}.js`,
      chunkFilename: `${assetsSubDirectory}js/${prefix}[name]${chunkHash}.js`,
      publicPath: '/', // Public path to 'dist' scope in production
    },
    // @see https://webpack.js.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
    devtool: (hasWatcher || hasStyleguide) ? 'source-map' : false,
    // Customizes build log
    stats: webpackStats(),
    // Warn about performance issues
    performance: {
      hints: (hasWatcher || hasStyleguide) ? false : 'warning',
      maxEntrypointSize: 500000, // 500kb
      maxAssetSize: 150000, // 150kb
    },
    plugins: plugins(),
    optimization: {
      minimize: !hasWatcher,
      minimizer: [
        new UglifyJsPlugin({
          test: /\.js($|\?)/i, // MUST be defined because file has as query
          cache: true,
          parallel: true,
          sourceMap: hasStyleguide
        })
      ],
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
          },
        }
      },
    }
  };

  if (isProduction) {
    return Object.assign(baseConfig, prodConfig);
  }

  return Object.assign(baseConfig, devConfig);
};
