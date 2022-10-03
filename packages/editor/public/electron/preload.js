const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ScrowlApp", {
  course: {
    newCourse: (blueprint) => ipcRenderer.invoke("course.newCourse", blueprint),
    loadCourse: (courseId, version) => ipcRenderer.invoke("course.loadCourse", courseId, version),
    saveCourse: (courseState) => ipcRenderer.invoke("course.saveCourse", courseState),

    publishCourse: (payload) => ipcRenderer.invoke("publishCourse", payload),

    loadRecent: () => ipcRenderer.invoke("course.loadRecent"),
    addNewAssets: (courseId, secureFileList) =>
      ipcRenderer.invoke("course.addNewAssets", courseId, secureFileList),

    deleteEmptyCourse: (courseId) => ipcRenderer.invoke("course.deleteEmptyCourse", courseId),

    setActiveCourse: (courseId) => ipcRenderer.invoke("course.setActiveCourse", courseId),
    clearActiveCourse: () => ipcRenderer.invoke("course.clearActiveCourse"),
  },
  dialog: {
    show: (options) => ipcRenderer.invoke("dialog.show", options),
    openFile: (options) => ipcRenderer.invoke("dialog.openFile", options),
    saveFile: (options) => ipcRenderer.invoke("dialog.saveFile", options),
    showFileInFolder: (secureFileId) => ipcRenderer.invoke("dialog.showFileInFolder", secureFileId),
  },

  settings: {
    get: (key, defaultValue) => ipcRenderer.invoke("settings.get", key, defaultValue),
    has: (key) => ipcRenderer.invoke("settings.has", key),
    clear: (key) => ipcRenderer.invoke("settings.clear", key),
    set: (key, value) => ipcRenderer.invoke("settings.set", key, value),
  },

  showPreview: (options) => ipcRenderer.invoke("showPreview", options),
  showResourcePreview: (payload) => ipcRenderer.invoke("showResourcePreview", payload),

  showContextMenu: (buttons, position) => ipcRenderer.invoke("showContextMenu", buttons, position),
  showEmojiPanel: () => ipcRenderer.invoke("showEmojiPanel"),
  getNativeTheme: () => ipcRenderer.invoke("getNativeTheme"),
  listenForThemeUpdate: () => ipcRenderer.invoke("listenForThemeUpdate"),
  prefersReducedMotion: () => ipcRenderer.invoke("prefersReducedMotion"),

  showRecentPublishedFile: () => ipcRenderer.invoke("showRecentPublishedFile"),

  updateAppMenu: (options) => ipcRenderer.invoke("updateAppMenu", options),
  setProgress: (progress) => ipcRenderer.invoke("setProgress", progress),
});

ipcRenderer.on("GLOBAL_ACTION", function (evt, menuAction) {
  window.postMessage({ action: "GLOBAL_ACTION", menuAction });
});
