const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoPrefixPlugin = require("autoprefixer");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cfg = require("./.babelrc");

const mode = process.env.NODE_ENV;

const isProd = mode === "production";

function prodOrDev(a, b) {
  return isProd ? a : b;
}

const jsLoaderOptions = (isLegacy) => ({
  test: /\.m?js$/,
  exclude: /(node_modules\/(?!@hydrophobefireman))|(injectables)/,
  use: {
    loader: "babel-loader",
    options: cfg.env[isLegacy ? "legacy" : "modern"],
  },
});
const cssLoaderOptions = {
  test: /\.css$/,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: "css-loader",
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: { plugins: [autoPrefixPlugin()] },
      },
    },
  ],
};
const contentLoaderOptions = {
  test: /\.(png|jpg|gif|ico|svg)$/,
  use: [{ loader: "url-loader", options: { fallback: "file-loader" } }],
};
function getEnvObject(isLegacy) {
  const prod = !isLegacy;
  return {
    arrowFunction: prod,
    const: prod,
    destructuring: prod,
    forOf: prod,
    dynamicImport: prod,
    module: prod,
  };
}
function getCfg(isLegacy) {
  return {
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
    devServer: {
      contentBase: `${__dirname}/dist`,
      compress: !0,
      port: 4200,
      historyApiFallback: true,
    },
    module: {
      rules: [
        jsLoaderOptions(isLegacy),
        cssLoaderOptions,
        contentLoaderOptions,
      ],
    },
    entry: `${__dirname}/frontend/src/index.js`,
    output: {
      environment: getEnvObject(isLegacy),
      path: `${__dirname}/dist/`,
      filename: `${isLegacy ? "legacy" : "es6"}/[name]-[contenthash].js`,
    },
    mode,
    optimization: {
      concatenateModules: false,
      minimizer: prodOrDev([new TerserWebpackPlugin({ parallel: true })], []),
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: "single",
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateParameters: async function templateParametersGenerator(
          compilation,
          files,
          tags,
          options
        ) {
          return {
            compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              tags,
              files,
              options,
            },
          };
        },
        inject: "body",
        template: `${__dirname}/frontend/index.html`,
        xhtml: !0,
        // favicon: "./favicon.ico",
        minify: prodOrDev(
          {
            collapseBooleanAttributes: !0,
            collapseWhitespace: !0,
            html5: !0,
            minifyCSS: !0,
            removeEmptyAttributes: !0,
            removeRedundantAttributes: !0,
          },
          !1
        ),
      }),
      new MiniCssExtractPlugin({}),
      isProd &&
        new OptimizeCSSAssetsPlugin({ cssProcessor: require("cssnano") }),
    ].filter(Boolean),
  };
}

module.exports = getCfg(false);
