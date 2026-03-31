var MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new MergeJsonWebpackPlugin({
        debug: false,
        output: {
          groupBy: [
            {
              pattern: "./authentication-techniques/*.json",
              fileName: "./assets/techniques.json"
            },
            {
              pattern: "./authenticators/*.json",
              fileName: "./assets/authenticators.json"
            }
          ]
        },
        globOptions: {
          nosort: false,
          prefixFileName: true
        }
      }),
      new CopyWebpackPlugin([
        {
          from: "./*.md",
          to: "./assets/[name].[ext]"
        },
        {
          from: "./slr/*.md",
          to: "./assets/[name].[ext]"
        },
        {
          from: "./assets/*.json",
          to: "./assets/[name].[ext]"
        },
        {
          from: "./assets/images/*.JPG",
          to: "./assets/[name].[ext]"
        },
        {
          from: "./assets/images/*.jpg",
          to: "./assets/[name].[ext]"
        }
      ])
    ]
  },
  publicPath: process.env.NODE_ENV === "production" ? "/authN-techniques-catalog/" : "/",
};
