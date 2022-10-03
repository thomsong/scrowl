const { app, Menu, nativeTheme, systemPreferences, BrowserWindow } = require("electron");

const path = require("path");
const fs = require("fs-extra");

const AppMenu = require("../AppMenu");
const PublishHandler = require("./PublishHandler");
const fsHelper = require("./utils/fsHelper");

class RootHandler {
  ipcMain = null;
  themeUpdateTimeout = null;

  constructor(ipcMain) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  addHandlers() {
    this.ipcMain.handle("showEmojiPanel", async (event) => {
      app.showEmojiPanel();

      return true;
    });

    this.ipcMain.handle("getNativeTheme", async (event) => {
      return JSON.parse(JSON.stringify(nativeTheme));
    });

    this.ipcMain.handle("prefersReducedMotion", async (event) => {
      return systemPreferences.getAnimationSettings().prefersReducedMotion ? true : false;
    });

    this.ipcMain.handle("listenForThemeUpdate", async (event) => {
      return new Promise((resolve) => {
        nativeTheme.on("updated", function (event) {
          if (this.themeUpdateTimeout) {
            clearTimeout(this.themeUpdateTimeout);
          }

          this.themeUpdateTimeout = setTimeout(() => {
            this.themeUpdateTimeout = null;

            resolve(JSON.parse(JSON.stringify(nativeTheme)));
          }, 50);
        });
      });
    });

    this.ipcMain.handle("updateAppMenu", async (event, options) => {
      AppMenu(options);
      return true;
    });

    this.ipcMain.handle("setProgress", async (event, progress) => {
      if (BrowserWindow.getAllWindows().length === 0) {
        // SHOULD NEVER HAPPEN
        return;
      }

      const barProgress = Math.max(Math.min(1, progress ? progress : 0), 0);
      BrowserWindow.getAllWindows()[0].setProgressBar(barProgress || -1);

      return barProgress;
    });

    this.ipcMain.handle("showResourcePreview", async (event, payload) => {
      if (BrowserWindow.getAllWindows().length === 0) {
        // SHOULD NEVER HAPPEN
        return;
      }

      const parentWindow = BrowserWindow.getAllWindows()[0];
      console.log("payload", payload);

      const { courseId, resource } = payload;

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const courseAssetPath = scrowlCoursesDir + courseId + "/assets/";

      parentWindow.previewFile(courseAssetPath + resource.url, resource.title);

      return true;
    });

    this.ipcMain.handle("showContextMenu", async (event, buttons, position) => {
      return new Promise((_resolve) => {
        let resolveSent = false;
        const resolve = (payload) => {
          if (resolveSent) {
            return;
          }

          resolveSent = true;
          _resolve(payload);
        };

        const template = buttons.map((button) => {
          if (button.type) {
            return { type: button.type };
          }

          const btn = {
            ...button,
            click: () => {
              resolve({ ...button });
            },
          };

          if (button.checked === false || button.checked === true) {
            btn.checked = button.checked;
            btn.type = "checkbox";
          }

          if (button.icon) {
            // TODO support dark mode

            btn.icon = path.join(
              __dirname,
              "/../icons/" + button.icon + (nativeTheme.shouldUseDarkColors ? "_dark" : "") + ".png"
            );
          }

          return btn;
        });

        const menu = Menu.buildFromTemplate(template);

        menu.once("menu-will-close", (e) => {
          // Hacky, but only way to get CLICK event first
          setTimeout(() => {
            resolve(false);
          }, 0);
        });

        if (position && position.length === 2) {
          menu.popup({
            window: BrowserWindow.fromWebContents(event.sender),
            x: position[0],
            y: position[1],
          });
        } else {
          menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
        }
      });
    });

    this.ipcMain.handle("showPreview", async (event, payload) => {
      if (BrowserWindow.getAllWindows().length === 0) {
        // SHOULD NEVER HAPPEN
        return;
      }
      payload.courseId = payload.course.id;
      payload.version = payload.course.version;

      delete payload.publish;
      delete payload.course;
      const { courseId } = payload;

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const coursePreviewPath = scrowlCoursesDir + courseId + "/preview/";

      const publishHandler = new PublishHandler(null);
      await publishHandler.publishCourse(payload);

      const parentWindow = BrowserWindow.getAllWindows()[0];
      const [parentWidth, parentHeight] = parentWindow.getSize();

      const padding = 100;

      const previewWindow = new BrowserWindow({
        center: true,
        width: Math.min(parentWidth - padding, 1280),
        height: parentHeight - padding,
        minWidth: 1024,
        minHeight: 600,

        parent: parentWindow,
        modal: true,

        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          spellcheck: false,
          sandbox: true,
          disableDialogs: true,
          preload: __dirname + "/../scorm_api.js",
        },
      });

      // previewWindow.webContents.openDevTools({ mode: "detach" });

      previewWindow.on("enter-html-full-screen", async () => {
        // We cannot require the screen module until the app is ready.
        const { screen } = require("electron");
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width, height } = primaryDisplay.workAreaSize;
        const parentWindowBounds = parentWindow.getContentBounds();
        const previewWindowBounds = previewWindow.getContentBounds();

        // Speeds up the process
        parentWindow.setOpacity(0);
        parentWindow.setContentBounds({ x: 0, y: 0, width, height }, false);
        parentWindow.setSimpleFullScreen(true);

        previewWindow.once("leave-html-full-screen", async () => {
          parentWindow.setSimpleFullScreen(false);

          parentWindow.setContentBounds(parentWindowBounds, false);

          // Seems to take a little while to get it focused
          for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 10));
            parentWindow.focus();
            previewWindow.setContentBounds(previewWindowBounds, false);
            parentWindow.setOpacity(1);
          }
        });
      });

      previewWindow.webContents.session.clearCache(function () {});
      previewWindow.loadURL("http://localhost:14191/preview.html");

      const doCleanup = () => {
        fs.rmSync(coursePreviewPath, { recursive: true, force: true });
      };

      return new Promise((resolve) => {
        previewWindow.once("closed", () => {
          doCleanup();
          resolve(true);
        });
      });
    });
  }
}

module.exports = RootHandler;
