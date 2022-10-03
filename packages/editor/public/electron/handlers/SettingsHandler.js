const settings = require("electron-settings");

class SettingsHandler {
  ipcMain = null;

  constructor(ipcMain) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  addHandlers() {
    this.ipcMain.handle("settings.get", async (event, key, defaultValue) => {
      if (key) {
        let value = await settings.get(key);
        if (value === null || value === undefined) {
          value = defaultValue;
        }
        return new Promise((resolve) => {
          resolve(value);
        });
      } else {
        // Get them all
        return settings.get();
      }
    });

    this.ipcMain.handle("settings.set", async (event, key, value) => {
      if (!key) {
        return false;
      } else {
        return settings.set(key, value);
      }
    });

    this.ipcMain.handle("settings.has", async (event, key) => {
      if (!key) {
        return false;
      } else {
        return settings.has(key);
      }
    });

    this.ipcMain.handle("settings.clear", async (event, key) => {
      if (!key) {
        return false;
      } else {
        return settings.unset(key);
      }
    });
  }
}

module.exports = SettingsHandler;
