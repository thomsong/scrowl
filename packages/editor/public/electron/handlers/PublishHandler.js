const { BrowserWindow, shell, dialog } = require("electron");
const scopackager = require("simple-scorm-packager");

const fsHelper = require("./utils/fsHelper");
const path = require("path");
const fs = require("fs-extra");
const os = require("os");

class PublishHandler {
  ipcMain = null;
  tmpPath = "";
  coursePath = "";
  courseId = "";
  version = 0;
  settings = {};
  courseData = {};
  previewMode = "";
  slideId = -1;
  lessonId = -1;
  moduleId = -1;

  lastOutputPath = "";

  constructor(ipcMain) {
    if (ipcMain) {
      this.ipcMain = ipcMain;
      this.addHandlers();
    }
  }

  addHandlers() {
    this.ipcMain.handle("publishCourse", async (event, payload) => {
      return this.publishCourse(payload);
    });

    this.ipcMain.handle("showRecentPublishedFile", async (event) => {
      if (this.outputPath) {
        shell.showItemInFolder(this.outputPath);
      }
    });
  }

  async publishCourse(payload) {
    const defaultSettings = {
      courseId: null,
      previewMode: "",
      slideId: -1,
      lessonId: -1,
      moduleId: -1,
    };

    const settings = { ...defaultSettings, ...payload };
    const { courseId, version, previewMode, slideId, lessonId, moduleId } = settings;
    delete settings.courseId;
    delete settings.version;

    if (!courseId) {
      return { error: "COURSE_ID_MISSING" };
    }

    if (!version) {
      return { error: "VERSION_MISSING" };
    }

    const scrowlCoursesDir = fsHelper.getScrowlDirectory("courses");
    this.coursePath = scrowlCoursesDir + courseId + "/";

    if (!fs.existsSync(this.coursePath)) {
      return { error: "COURSE_PATH_MISSING", coursePath: this.coursePath };
    }

    this.courseId = courseId;
    this.version = version;
    this.previewMode = previewMode;
    this.slideId = slideId;
    this.lessonId = lessonId;
    this.moduleId = moduleId;

    this.settings = settings;

    return await this.processPublishCourse();
  }

  async processPublishCourse() {
    console.log("");
    console.log("");
    console.log("--------------------------------");
    console.log("         PUBLISH COURSE         ");
    console.log("--------------------------------");
    console.log("");
    console.log("courseId:", this.courseId);
    console.log("version:", this.version);

    console.log("previewMode:", this.previewMode);
    console.log("slideId:", this.slideId);
    console.log("lessonId:", this.lessonId);
    console.log("moduleId:", this.moduleId);

    // console.log("settings:", this.settings);
    console.log("");

    return new Promise(async (resolve) => {
      this.getDestPath();

      if (!this.destScormPath) {
        console.log("Canceled");
        resolve(false);
        return;
      }

      console.log("Publish Step 1");
      this.createTmpFolder();

      console.log("Publish Step 2");
      this.addPlayer();

      console.log("Publish Step 3");
      await this.loadCourseData();

      console.log("Publish Step 4");
      this.addCourseData();

      console.log("Publish Step 5");
      this.addThemes();

      console.log("Publish Step 6");
      this.addTemplates();

      if (!this.previewMode) {
        console.log("Publish Step 7");
        this.addCourseAssets();

        console.log("Publish Step 8");
        const scormResult = await this.packageScorm();

        this.outputPath = scormResult.filename;

        console.log("Publish Step 10");
        this.cleanup();
      } else {
        this.outputPath = "";
      }

      resolve(true);
    });
  }

  getDestPath() {
    if (this.previewMode) {
      this.destScormPath = "preview";
      return;
    }

    const mainWindow = BrowserWindow.getAllWindows()[0];
    const result = dialog.showOpenDialogSync(mainWindow, {
      buttonLabel: "Select Folder",
      properties: ["createDirectory", "openDirectory", "dontAddToRecent"],
    });

    this.destScormPath = null;

    if (result) {
      this.destScormPath = result[0];
    }
  }

  createTmpFolder() {
    if (this.previewMode) {
      this.tmpPath = this.coursePath + "preview/";

      fs.rmSync(this.tmpPath, { recursive: true, force: true });

      fs.mkdirSync(this.tmpPath, { recursive: true });
    } else {
      fs.mkdirSync(path.join(os.tmpdir(), "scrowl"), { recursive: true });
      this.tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), "scrowl/publish-"));
    }

    console.log("this.tmpPath", this.tmpPath);
  }

  addPlayer() {
    const playerPath = path.join(__dirname, "/../../player");
    fs.cpSync(playerPath, this.tmpPath + "/player", { recursive: true, dereference: true });

    return true;
  }

  async loadCourseData() {
    const courseDataFile = "course_v" + this.version;
    const courseDataPath = this.coursePath + courseDataFile;

    const courseJSON = await fsHelper.getUnzip(courseDataPath);
    if (!courseJSON || courseJSON.error) {
      return courseJSON; // This will have error info in it
    }

    // TODO: Remove unused/more private data/fields
    // Notes, author, etc..
    this.courseData = JSON.parse(courseJSON);

    this.courseData.preview = {};
    if (this.previewMode) {
      if (this.previewMode === "slide") {
        this.courseData.preview.slideId = this.slideId;
        this.courseData.preview.lessonId = this.lessonId;
        this.courseData.preview.moduleId = this.moduleId;
      } else if (this.previewMode === "lesson") {
        this.courseData.preview.lessonId = this.lessonId;
        this.courseData.preview.moduleId = this.moduleId;
      } else if (this.previewMode === "module") {
        this.courseData.preview.moduleId = this.moduleId;
      }
    }
  }

  addCourseData() {
    let courseDataJS = "window.courseData = " + JSON.stringify(this.courseData);
    fs.writeFileSync(this.tmpPath + "/player/course_data.js", courseDataJS);
  }

  addThemes() {
    fs.mkdirSync(this.tmpPath + "/player/assets/themes", { recursive: true });

    const themesPath = path.join(__dirname, "/../../assets/themes");
    fs.cpSync(themesPath, this.tmpPath + "/player/assets/themes", { recursive: true });
  }

  addTemplates() {
    fs.mkdirSync(this.tmpPath + "/player/assets/templates", { recursive: true });

    // TODO: Only copy over templates + versions that are needed
    const templatesPath = path.join(__dirname, "/../../assets/templates");
    fs.cpSync(templatesPath, this.tmpPath + "/player/assets/templates", { recursive: true });
  }

  addCourseAssets() {
    fs.mkdirSync(this.tmpPath + "/player/course/assets", { recursive: true });

    // TODO: Only copy over assets that are needed
    const assetsPath = this.coursePath + "assets";
    fs.cpSync(assetsPath, this.tmpPath + "/player/course/assets", { recursive: true });
  }

  async packageScorm() {
    return new Promise((resolve, reject) => {
      // this.destScormPath
      // return;
      console.log("publish settings", this.courseData.publish);

      const result = scopackager(
        {
          version: "2004 4th Edition",
          startingPage: "player/index.html",
          source: this.tmpPath,
          language: "en",

          organization: this.courseData.publish.organization || "scrowl",
          title: this.courseData.publish.name || this.courseData.course.name,
          identifier: this.courseData.publish.lmsIdentifier || this.courseData.course.id,
          masteryScore: 80,

          package: {
            outputFolder: this.previewMode ? this.tmpPath : this.destScormPath,
            zip: this.previewMode ? false : true,

            rights: "©Copyright " + new Date().getFullYear(),
            version: this.courseData.course.version,
            name: this.courseData.course.name,
            author: this.courseData.publish.authors,
            description: this.courseData.publish.description,

            // duration: "PT5H43M49S",
            // typicalDuration: "PT4H3M21S",
            // requirements: [
            //   {
            //     type: "Requirement type 1",
            //     name: "Requirement name 1",
            //     version: "r1MinVer",
            //   }x
            // ],
          },
        },
        function (result) {
          resolve({ success: true, ...result });
        }
      );
    });
  }

  cleanup() {
    fs.rmSync(this.tmpPath, { recursive: true, force: true });

    this.tmpPath = "";
  }
}

module.exports = PublishHandler;
