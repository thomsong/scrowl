const fs = require("fs");
const path = require("path");

const destPublicDir = path.resolve("../../public/assets/blueprints/");
fs.rmSync(destPublicDir, { recursive: true, force: true });
fs.mkdirSync(destPublicDir, { recursive: true });

const dirContents = fs.readdirSync(__dirname);

dirContents.forEach((item) => {
  if (fs.existsSync(__dirname + "/" + item + "/course_v1.json")) {
    console.log("Found Blueprint: " + item);
    fs.cpSync(__dirname + "/" + item, destPublicDir + "/" + item, { recursive: true });
  }
});

console.log("Blueprints build successful");
