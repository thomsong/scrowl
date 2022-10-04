const TerserPlugin = require("terser-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin-next");
const fs = require("fs");
const path = require("path");

module.exports = (templatePath) => {
  const packageJSON = require(templatePath + "/package.json");
  const majorMinorVer = packageJSON.version.split(".").slice(0, 2).join(".");

  const templateKey = packageJSON.name + "@" + majorMinorVer;

  const destPublicDir = path.resolve("../../../public/assets/templates/" + templateKey);
  fs.rmSync(destPublicDir, { recursive: true, force: true });
  fs.mkdirSync(destPublicDir, { recursive: true });

  // Create assets folder in template if it doesn't exist
  fs.mkdirSync(templatePath + "/assets", { recursive: true });

  return {
    entry: templatePath + "/src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                additionalData: (content, loaderContext) => {
                  return content.replace(
                    "#TEMPLATE",
                    "section." + templateKey.replace(/[\W_]+/g, "-")
                  );
                },
              },
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js", ".scss"],
    },

    output: {
      filename: "index.js",
      libraryTarget: "umd",
    },

    externals: {
      "embed-host": "host",
      animejs: "anime",
      react: "react",
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },

    externalsType: "window",

    plugins: [
      new WebpackShellPlugin({
        onAfterDone: {
          scripts: [
            // This is needed to prevent Webpack errors when being used in Scrowl
            "printf '%s\n%s\n' '/* eslint-disable no-unused-expressions */' \"$(cat ./dist/index.js)\" > ./dist/index.js",

            "cp ./dist/index.js " + destPublicDir,
            "cp -r ./assets " + destPublicDir,
          ],
        },

        blocking: true,
        parallel: false,
      }),
    ],
  };
};
