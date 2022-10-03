const fs = require("fs");
const findRemoveSync = require("find-remove");

const destPublicDir = "../../public/player";
fs.rmSync(destPublicDir, { recursive: true, force: true });
fs.mkdirSync(destPublicDir, { recursive: true });

fs.cpSync("./build/index.html", destPublicDir + "/index.html", { recursive: true });
fs.cpSync("./build/static", destPublicDir + "/static", { recursive: true });

findRemoveSync(destPublicDir + "/static", { extensions: [".map"] });
