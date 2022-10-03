const TerserPlugin = require("terser-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin-next");
const fs = require("fs");
const path = require("path");

module.exports = (templatePath) => {
  const destPublicDir = path.resolve("../../public/js");
  fs.mkdirSync(destPublicDir, { recursive: true });

  return {
    entry: "./src/index.tsx",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "embed-host.js",
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },

    plugins: [
      new WebpackShellPlugin({
        onAfterDone: {
          scripts: ["cp ./dist/embed-host.js " + destPublicDir],
        },

        blocking: true,
        parallel: false,
      }),
    ],
  };
};
