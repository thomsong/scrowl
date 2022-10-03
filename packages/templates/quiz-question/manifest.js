const _package = require("./package.json");

module.exports = {
  name: _package.name,
  version: _package.version,
  description: _package.description,
  author: _package.author,
  license: _package.license,

  slideLock: true,
};
