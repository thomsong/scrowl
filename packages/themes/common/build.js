const sass = require("sass");
const fs = require("fs");
const path = require("path");

const themePath = process.cwd();

const packageJSON = require(themePath + "/package.json");
const majorMinorVer = packageJSON.version.split(".").slice(0, 2).join(".");
const themeKey = packageJSON.name + "@" + majorMinorVer;

const destPublicDir = path.resolve("../../../public/assets/themes/" + themeKey);
fs.rmSync(destPublicDir, { recursive: true, force: true });
fs.mkdirSync(destPublicDir, { recursive: true });

const compressed = sass.compile(themePath + "/src/style.scss", { style: "expanded" }); // "compressed"
fs.writeFileSync(destPublicDir + "/style.css", compressed.css);

fs.cpSync(themePath + "/src/assets", destPublicDir + "/assets", { recursive: true });

console.log("Theme [" + themeKey + "] build successful");
