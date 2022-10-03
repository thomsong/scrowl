const { app, ipcMain, BrowserWindow, session } = require("electron");
const settings = require("electron-settings");
const contextMenu = require("electron-context-menu");
const fs = require("fs");

const ScrowlApp = require("./electron/ScrowlApp");
const AppMenu = require("./electron/AppMenu");
const LocalServer = require("./electron/LocalServer");

const isDev = process.env.ENVIRONMENT === "dev" ? true : false;

app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("allow-insecure-localhost", "true");

// Used for dev purposes
if (process.env.RESET) {
  fs.rmSync(app.getPath("userData"), { recursive: true, force: true });
  console.log("Reset done");
  process.exit();
}

contextMenu({
  menu: (actions, props, browserWindow, dictionarySuggestions) => [
    ...dictionarySuggestions,
    actions.separator(),
    actions.cut(),
    actions.copy(),
    actions.paste(),
  ],
});

LocalServer.start();

async function createWindow() {
  // We cannot require the screen module until the app is ready.
  const { screen } = require("electron");

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowBounds = (await settings.get("window:bounds")) || {
    width: Math.floor(width * 0.8),
    height: Math.floor(height * 0.8),
  };

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    center: true,
    width: windowBounds.width,
    height: windowBounds.height,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + "/electron/preload.js",
      spellcheck: true,
      disableDialogs: true,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true,
    },
  });

  if (windowBounds.x && windowBounds.y) {
    mainWindow.setBounds(windowBounds);
  }

  mainWindow.loadURL("http://localhost:14191", { userAgent: "scrowl" });

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("resized", () => {
    settings.set("window:bounds", mainWindow.getBounds());
  });

  mainWindow.on("moved", () => {
    settings.set("window:bounds", mainWindow.getBounds());
  });

  // mainWindow.on("close", (e) => {
  // Check what we should do regarding save/discard/cancel
  // e.preventDefault();

  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  session.defaultSession.cookies.flushStore();

  ScrowlApp.addHandlers(ipcMain);

  app.name = "Scrowl";

  AppMenu();

  // const appMenu = Menu.getApplicationMenu();
  // console.log("appMenu", appMenu);

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  session.defaultSession.cookies.flushStore();

  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    return;
  }

  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.restore();
  mainWindow.focus();
});

app.on("will-quit", (e) => {
  // TODO: Ask user to save changes first
  // e.preventDefault();

  LocalServer.close();
});

app.once("quit", () => {
  session.defaultSession.cookies.flushStore();
});
