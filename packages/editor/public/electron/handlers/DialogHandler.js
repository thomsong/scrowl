const { dialog, shell } = require("electron");
const path = require("path");
const md5 = require("md5");
const fs = require("fs");
const fsHelper = require("./utils/fsHelper");

class DialogHandler {
  ipcMain = null;

  constructor(ipcMain) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  getSecureFileRefs(result) {
    if (!result) {
      return [];
    }

    const secureFileList = [];
    result.map((filePath) => {
      const fileName = path.parse(filePath).base;
      const secureId = md5(filePath);

      const fileStats = fs.statSync(filePath);
      const fileSize = fileStats.size;

      fsHelper.fileRefs[secureId] = filePath;

      secureFileList.push({
        secureId,
        name: fileName,
        size: fileSize,
      });

      return null;
    });

    return secureFileList;
  }

  addHandlers() {
    // https://www.electronjs.org/docs/latest/api/dialog

    // window.ScrollApp.dialog.show({message:"Hello World"});
    this.ipcMain.handle("dialog.show", async (event, options) => {
      if (typeof options != "object") {
        options = {};
      }

      const defaultOptions = {
        message: "Default message",
      };

      return dialog.showMessageBox({ ...defaultOptions, ...options });
    });

    // window.ScrollApp.dialog.saveFile({buttonLabel:"Select Files"});
    this.ipcMain.handle("dialog.openFile", async (event, options) => {
      if (typeof options != "object") {
        options = {};
      }

      return this.getSecureFileRefs(
        dialog.showOpenDialogSync({
          buttonLabel: options.buttonLabel || "Open",
          filters: [{ name: "All Files", extensions: ["*"] }],

          properties: ["openFile", "multiSelections", "dontAddToRecent", "treatPackageAsDirectory"],
        })
      );
    });

    // window.ScrollApp.dialog.saveFile({buttonLabel:"Publish Project", defaultPath:"test.zip"});
    this.ipcMain.handle("dialog.saveFile", async (event, options) => {
      if (typeof options != "object") {
        options = {};
      }

      return this.getSecureFileRefs(
        dialog.showSaveDialogSync({
          buttonLabel: options.buttonLabel || "Save",
          defaultPath: options.defaultPath || "untitled",
          properties: ["createDirectory", "showOverwriteConfirmation"],
        })
      );
    });

    //window.ScrollApp.dialog.showFileInFolder('1234');
    this.ipcMain.handle("dialog.showFileInFolder", async (event, secureFileId) => {
      const fullPath = fsHelper.fileRefs[secureFileId];

      if (!fullPath) {
        return false;
      }

      return shell.showItemInFolder(fullPath);
    });
  }
}

module.exports = DialogHandler;
