const { BrowserWindow } = require("electron");

const fsHelper = require("./utils/fsHelper");
const path = require("path");
const fs = require("fs-extra");
const uuid = require("uuid");
const nodeProjectJSON = require("../../../package.json");
const os = require("os");
const cpFile = require("cp-file");
const nodeStatic = require("node-static");
const LocalServer = require("../LocalServer");

class CourseHandler {
  ipcMain = null;

  constructor(ipcMain) {
    this.ipcMain = ipcMain;
    this.addHandlers();
  }

  getLottieAnimationName(filePath) {
    try {
      const fileSize = fs.statSync(filePath).size;

      // TODO: Notify the user
      if (fileSize > 5 * 1024 * 1024) {
        // 5mb max file size
        return false;
      }

      const jsonData = fs.readJSONSync(filePath);
      if (jsonData.fr && jsonData.nm && jsonData.layers) {
        return jsonData.nm.trim();
      }
    } catch (err) {
      return false;
    }

    return false;
  }

  setCourseFileResponder(courseId) {
    if (!courseId) {
      LocalServer.setCourseFileResponder(false);

      return;
    }

    const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
    const coursePath = scrowlCoursesDir + courseId + "/";

    if (!fs.existsSync(coursePath)) {
      return { error: "COURSE_PATH_MISSING", coursePath };
    }

    const courseFileResponder = new nodeStatic.Server(coursePath, {
      cache: false,
    }); //, { cache: 15 });

    LocalServer.setCourseFileResponder(courseFileResponder);
  }

  addHandlers() {
    this.ipcMain.handle("course.newCourse", async (event, blueprint) => {
      if (!blueprint) {
        return false;
      }

      const rootBlueprintPath = path.join(__dirname, "/../../assets/blueprints/");
      const blueprintPath = rootBlueprintPath + blueprint;

      if (!fs.existsSync(blueprintPath)) {
        return { error: "INVALID_BLUEPRINT" };
      }

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");

      const courseId = uuid.v4();
      const coursePath = scrowlCoursesDir + courseId + "/";

      if (fs.existsSync(coursePath)) {
        return { error: "COURSE_ID_EXISTS" };
      }

      fs.mkdirSync(coursePath);

      // Copy blueprint
      fs.copySync(blueprintPath, coursePath);

      // Init new course
      const courseDataFile = "course_v1";
      const courseJSON = fs.readFileSync(coursePath + courseDataFile + ".json");
      const courseData = JSON.parse(courseJSON);

      courseData.course.id = courseId;
      courseData.course.scrowlVer = nodeProjectJSON.version;
      courseData.course.dateCreated = Math.floor(new Date().getTime() / 1000);
      courseData.course.createdBy = os.userInfo().username;

      fs.writeFileSync(coursePath + courseDataFile + ".json", JSON.stringify(courseData, null, 2));
      await fsHelper.zip(coursePath + courseDataFile + ".json", coursePath + courseDataFile);
      // fs.unlink(coursePath + courseDataFile + ".json");

      return { id: courseId };
    });

    this.ipcMain.handle("course.loadCourse", async (event, courseId, version) => {
      if (!courseId) {
        return { error: "COURSE_ID_MISSING" };
      }

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const coursePath = scrowlCoursesDir + courseId + "/";

      if (!fs.existsSync(coursePath)) {
        return { error: "COURSE_PATH_MISSING", coursePath };
      }

      if (!version) {
        // Find latest version
        const courseFiles = await fs.readdir(coursePath);

        version = courseFiles.reduce((maxVer, file) => {
          if (file.startsWith("course_v")) {
            const ver = parseInt(file.substring(8));
            if (ver) {
              return Math.max(maxVer, ver);
            }
          }
          return maxVer;
        }, 0);

        if (!version) {
          return { error: "VERION_MISSING" };
        }
      }

      const courseDataFile = "course_v" + version;
      const courseDataPath = coursePath + courseDataFile;

      const courseJSON = fs.readFileSync(courseDataPath + ".json") + "";

      // if (!fs.existsSync(courseDataPath)) {
      // return { error: "COURSE_V" + version + "_MISSING", courseDataPath };
      // }

      // const courseJSON = await fsHelper.getUnzip(courseDataPath);
      // if (!courseJSON || courseJSON.error) {
      // return courseJSON;
      // }
      JSON.parse(courseJSON);
      // console.log("courseJSON", courseJSON);
      try {
        return JSON.parse(courseJSON);
      } catch (e) {
        return { error: "COURSE_CURRUPT" };
      }
    });

    this.ipcMain.handle("course.setActiveCourse", async (event, courseId) => {
      this.setCourseFileResponder(courseId);
    });

    this.ipcMain.handle("course.clearActiveCourse", async (event) => {
      this.setCourseFileResponder(false);
    });

    this.ipcMain.handle("course.deleteEmptyCourse", async (event, courseId) => {
      if (!courseId) {
        return { error: "COURSE_ID_MISSING" };
      }

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const coursePath = scrowlCoursesDir + courseId + "/";

      if (!fs.existsSync(coursePath)) {
        return { error: "COURSE_PATH_MISSING", coursePath };
      }

      // Find latest version
      const courseFiles = await fs.readdir(coursePath);
      const maxVersion = courseFiles.reduce((maxVer, file) => {
        if (file.startsWith("course_v")) {
          const ver = parseInt(file.substring(8));
          if (ver) {
            return Math.max(maxVer, ver);
          }
        }
        return maxVer;
      }, 0);

      if (maxVersion > 1) {
        return { error: "COURSE_NOT_EMPTY" };
      }

      fs.removeSync(coursePath);

      return true;
    });

    this.ipcMain.handle("course.saveCourse", async (event, courseState) => {
      if (!courseState) {
        return { error: "COURSE_STATE_MISSING" };
      }

      const courseId = courseState.course.id;

      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const coursePath = scrowlCoursesDir + courseId + "/";

      if (!fs.existsSync(coursePath)) {
        return { error: "COURSE_PATH_MISSING", coursePath };
      }

      // Find latest version
      const courseFiles = await fs.readdir(coursePath);
      const maxVersion = courseFiles.reduce((maxVer, file) => {
        if (file.startsWith("course_v")) {
          const ver = parseInt(file.substring(8));
          if (ver) {
            return Math.max(maxVer, ver);
          }
        }
        return maxVer;
      }, 0);

      const newVersion = maxVersion + 1;

      const saveState = {};

      saveState.course = courseState.course;

      saveState.course.scrowlVer = nodeProjectJSON.version;
      saveState.course.lastSaved = Math.floor(new Date().getTime() / 1000);
      saveState.course.version = newVersion;

      saveState.publish = courseState.publish || {};
      saveState.assets = courseState.assets || [];
      saveState.modules = courseState.modules || [];
      saveState.lessons = courseState.lessons || [];
      saveState.slides = courseState.slides || [];
      saveState.glossaryTerms = courseState.glossaryTerms || [];
      saveState.resources = courseState.resources || [];

      const courseDataFile = "course_v" + newVersion;
      const courseDataPath = coursePath + courseDataFile;

      fs.writeFileSync(courseDataPath + ".json", JSON.stringify(saveState, null, 2));
      await fsHelper.zip(courseDataPath + ".json", courseDataPath);
      // fs.unlink(courseDataPath + ".json");

      // Add it to recent.json
      let recentData = null;

      try {
        const recentJSON = fs.readFileSync(scrowlCoursesDir + "recent.json");
        recentData = JSON.parse(recentJSON);
      } catch (e) {
        recentData = [];
      }

      // Remove current course from recent list
      recentData = recentData.filter((course) => course.id !== courseId);

      // Add it to front of list
      recentData.unshift(saveState.course);

      // Cap it to 25 items
      fs.writeFileSync(scrowlCoursesDir + "recent.json", JSON.stringify(recentData.slice(0, 25)));

      return saveState.course;
    });

    this.ipcMain.handle("course.loadRecent", async (event) => {
      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");

      let recentData = null;
      try {
        const recentJSON = fs.readFileSync(scrowlCoursesDir + "recent.json");
        recentData = JSON.parse(recentJSON);
      } catch (e) {
        recentData = [];
      }

      return recentData;
    });

    this.ipcMain.handle("course.addNewAssets", async (event, courseId, secureFileList) => {
      const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
      const coursePath = scrowlCoursesDir + courseId + "/";
      const courseAssetPath = coursePath + "assets/";

      if (!fs.existsSync(coursePath)) {
        return { error: "COURSE_PATH_MISSING", coursePath };
      }

      if (!fs.existsSync(courseAssetPath)) {
        fs.mkdirSync(courseAssetPath);
      }

      // console.log("secureFileList", secureFileList);

      const newAssetList = [];

      for (let i = 0; i < secureFileList.length; i++) {
        const { secureId } = secureFileList[i];

        const filePath = fsHelper.fileRefs[secureId];
        const { fileHash, fileSize } = await fsHelper.quickHash(filePath);
        newAssetList.push([filePath, fileHash, fileSize]);
      }

      this.copyAssets(courseId, newAssetList);

      return newAssetList;
    });
  }

  async copyAssets(courseId, assetList) {
    const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
    const coursePath = scrowlCoursesDir + courseId + "/";
    const courseAssetPath = coursePath + "assets/";

    if (!fs.existsSync(courseAssetPath)) {
      return { error: "ASSET_PATH_MISSING", courseAssetPath };
    }

    const totalAssetSize = assetList.reduce((a, p) => {
      return a + p[2];
    }, 0);

    const mainWindow = BrowserWindow.getAllWindows()[0];

    let lastUpdateTime = 0;
    let lastUpdateProgress = 0;
    const sendUpdate = (filename, totalProgress, progress) => {
      const timeSinceLastUpdate = performance.now() - lastUpdateTime;

      // 50 ms updates
      if (timeSinceLastUpdate > 50 || totalProgress >= 100 || progress >= 100) {
        lastUpdateTime = performance.now();

        const newUpdateProgress = totalProgress * 100 + progress;

        if (newUpdateProgress !== lastUpdateProgress) {
          console.log("sendUpdate", filename, totalProgress, progress);

          mainWindow.webContents.send("GLOBAL_ACTION", {
            id: "COPY_ASSET_PROGRESS",
            args: { filename, totalProgress, progress },
          });

          lastUpdateProgress = newUpdateProgress;
        }
      }
    };

    let copyBytesLeft = totalAssetSize;
    const stateUpdate = {};

    for (let i = 0; i < assetList.length; i++) {
      const [filePath, fileHash, fileSize] = assetList[i];

      // console.log("Copy", filePath, fileHash, fileSize);

      let fileExt = (filePath.includes(".") ? filePath.split(".").pop() : "").toLowerCase();
      let fileName = path.parse(filePath).base;
      fileName = fileName.substring(0, fileName.length - fileExt.length) + fileExt; // lowercase ext

      if (fileExt === "json") {
        const lottieName = this.getLottieAnimationName(filePath);

        if (lottieName) {
          fileExt = "lottie";
          fileName = lottieName + ".lottie";
        }
      }

      stateUpdate[fileHash] = { fileName, fileExt, fileHash, fileSize };

      // eslint-disable-next-line no-loop-func
      await cpFile(filePath, courseAssetPath + fileHash + "." + fileExt).on("progress", (data) => {
        const totalBytesLeft = Math.max(0, copyBytesLeft - data.writtenBytes);

        sendUpdate(
          fileName,
          Math.round((100 * (totalAssetSize - totalBytesLeft)) / totalAssetSize),
          Math.round(data.percent * 100)
        );
      });

      copyBytesLeft -= fileSize;

      sendUpdate(
        fileName,
        Math.round((100 * (totalAssetSize - copyBytesLeft)) / totalAssetSize),
        100
      );
    }

    mainWindow.webContents.send("GLOBAL_ACTION", { id: "COPY_ASSET_COMPLETE", args: stateUpdate });
  }
}

module.exports = CourseHandler;
