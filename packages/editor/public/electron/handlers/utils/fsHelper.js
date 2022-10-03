const fs = require("fs");
const os = require("os");
const { createGzip, createGunzip } = require("node:zlib");
const { pipeline } = require("node:stream");
const { promisify } = require("node:util");
const { createReadStream, createWriteStream } = require("node:fs");
const hasha = require("hasha");
const md5 = require("md5");

module.exports = {
  fileRefs: {},

  // This is not ideal, but it's a quick way to do a best hash guess
  // Hash first mb, last mb and filesize.
  quickHash: (filePath) => {
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;

    const startStream = fs.createReadStream(filePath, {
      encoding: null,
      start: 0,
      end: Math.min(fileSize, 1024 * 1024),
    });

    const endStream =
      fileSize > 1024 * 1024
        ? fs.createReadStream(filePath, {
            encoding: null,
            start: Math.max(0, fileSize - 1024 * 1024),
            end: fileSize,
          })
        : null;

    return new Promise(async (resolve) => {
      const startStreamHash = await hasha.fromStream(startStream, { algorithm: "md5" });
      const endStreamHash = endStream
        ? await hasha.fromStream(endStream, { algorithm: "md5" })
        : startStreamHash;

      const fileHash = md5("S:" + startStreamHash + ":E:" + endStreamHash + ":FS:" + fileSize);
      resolve({ fileHash, fileSize });
    });
  },

  zip: (input, output) => {
    const pipe = promisify(pipeline);
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);
    return pipe(source, gzip, destination);
  },

  unzip: (input, output) => {
    const pipe = promisify(pipeline);
    const gunzip = createGunzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);
    return pipe(source, gunzip, destination);
  },

  getUnzip: (input) => {
    return new Promise((resolve) => {
      const buffer = [];
      const gunzip = createGunzip();
      fs.createReadStream(input).pipe(gunzip);

      gunzip.on("error", function (event) {
        resolve({ error: "The course data is corrupt", event: JSON.parse(JSON.stringify(event)) });
      });

      gunzip.on("end", function () {
        resolve(buffer.join(""));
      });

      gunzip.on("data", function (data) {
        const stringVal = data.toString();
        if (stringVal) {
          buffer.push(stringVal);
        }
      });
    });
  },

  getScrowlDirectory: (folderType) => {
    if (!folderType) {
      return null;
    }

    const userHomeDir = os.homedir();

    // TODO check if this works on Windows
    const scrowlHomeDir = userHomeDir + "/Scrowl/";

    // Create scrowl folder if it doesn't exist
    if (!fs.existsSync(scrowlHomeDir)) {
      fs.mkdirSync(scrowlHomeDir);
    }

    if (folderType != "home") {
      // Create folder if it doesn't exist
      if (!fs.existsSync(scrowlHomeDir + folderType + "/")) {
        fs.mkdirSync(scrowlHomeDir + folderType + "/");
      }

      return scrowlHomeDir + folderType + "/";
    }

    return scrowlHomeDir;
  },

  addCourseToRecents: (courseId) => {},
};
