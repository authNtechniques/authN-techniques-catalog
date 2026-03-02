var MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

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
      })
    ]
  },
  publicPath: process.env.NODE_ENV === "production" ? "/authN-techniques-catalog/" : "/"
  //publicPath: process.env.NODE_ENV === "production" ? "/" : "/"
};
