const RootHandler = require("./handlers/RootHandler");
const DialogHandler = require("./handlers/DialogHandler");
const SettingsHandler = require("./handlers/SettingsHandler");
const CourseHandler = require("./handlers/CourseHandler");
const PublishHandler = require("./handlers/PublishHandler");

class ScrollApp {
  ipcMain = null;

  addHandlers(ipcMain) {
    this.ipcMain = ipcMain;

    new RootHandler(ipcMain);
    new DialogHandler(ipcMain);
    new SettingsHandler(ipcMain);
    new CourseHandler(ipcMain);
    new PublishHandler(ipcMain);
  }
}

module.exports = new ScrollApp();
