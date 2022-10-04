/* config-overrides.js */

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function (config, env) {
    const rules = config.module.rules;
    rules.push({
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    });

    return config;
  },
};
