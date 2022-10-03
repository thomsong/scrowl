const { Menu, BrowserWindow } = require("electron");

const handleAction = (id, args) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.webContents.send("GLOBAL_ACTION", { id, args });
};

const isMac = process.platform === "darwin";

function setMenu(props) {
  const defaultProps = {
    courseIsOpened: false,
    slideSelected: false,
    previewMethod: "COURSE",
    recentCourses: [],
  };

  const menuProps = { ...defaultProps, ...props };
  let openRecentItems = [
    {
      label: "No Recent Courses",
      enabled: false,
    },
  ];
  if (menuProps.recentCourses.length) {
    openRecentItems = menuProps.recentCourses.map((course) => ({
      label: course.name,
      click: () => handleAction("OPEN_COURSE", course.id),
    }));
  }
  const template = [
    { role: "appMenu" },
    {
      label: "File",
      submenu: [
        {
          label: "New Course",
          accelerator: isMac ? "Cmd+N" : "Alt+N",
          click: () => handleAction("NEW_COURSE"),
        },
        { type: "separator" },
        {
          label: "Open...",
          accelerator: isMac ? "Cmd+O" : "Alt+O",
          click: () => handleAction("OPEN_COURSE"),
        },

        {
          label: "Open Recent",
          submenu: openRecentItems,
        },

        { type: "separator" },
        {
          label: "Save",
          accelerator: isMac ? "Cmd+S" : "Alt+S",
          enabled: menuProps.courseIsOpened,
          click: () => handleAction("SAVE"),
        },
        // {
        //   label: "Save As...",
        //   enabled: menuProps.courseIsOpened,
        //   click: () => handleAction("SAVE_AS"),
        // },
        { type: "separator" },
        {
          label: "Close Course",
          accelerator: isMac ? "Cmd+W" : "Alt+W",
          enabled: menuProps.courseIsOpened,
          click: () => handleAction("CLOSE_COURSE"),
        },
        ...(!isMac ? [{ type: "separator" }, { role: "quit" }] : []),
      ],
    },
    { role: "editMenu" },
    {
      label: "Outline",
      enabled: menuProps.courseIsOpened,
      submenu: [
        {
          label: "Add New Slide",
          enabled: menuProps.slideSelected,
          accelerator: isMac ? "Cmd+Shift+S" : "Alt+Shift+S",
          click: () => handleAction("ADD_NEW", "slide"),
        },
        {
          label: "Add New Lesson",
          enabled: menuProps.slideSelected,
          accelerator: isMac ? "Cmd+Shift+L" : "Alt+Shift+L",
          click: () => handleAction("ADD_NEW", "lesson"),
        },
        {
          label: "Add New Module",
          accelerator: isMac ? "Cmd+Shift+M" : "Alt+Shift+M",
          click: () => handleAction("ADD_NEW", "module"),
        },
        { type: "separator" },
        {
          label: "Duplicate Slide",
          enabled: menuProps.slideSelected,
          accelerator: isMac ? "Cmd+D" : "Alt+D",
          click: () => handleAction("DUPLICATE_SLIDE"),
        },
        {
          label: "Rename Slide",
          enabled: menuProps.slideSelected,
          accelerator: isMac ? "Cmd+R" : "Alt+R",
          click: () => handleAction("RENAME_SLIDE"),
        },
        { type: "separator" },
        {
          label: "Delete Slide",
          enabled: menuProps.slideSelected,
          accelerator: isMac ? "Cmd+Shift+D" : "Alt+Shift+D",
          click: () => handleAction("DELETE_SLIDE"),
        },
      ],
    },
    {
      label: "Preview",
      enabled: menuProps.courseIsOpened,
      accelerator: isMac ? "Cmd+A" : "Alt+A",
      submenu: [
        {
          type: "checkbox",
          label: "Current Slide",
          checked: menuProps.previewMethod === "SLIDE",
          click: () => handleAction("PREVIEW", "slide"),
        },
        {
          type: "checkbox",
          label: "Current Lesson",
          checked: menuProps.previewMethod === "LESSON",
          click: () => handleAction("PREVIEW", "lesson"),
        },
        {
          type: "checkbox",
          label: "Current Module",
          checked: menuProps.previewMethod === "MODULE",
          click: () => handleAction("PREVIEW", "module"),
        },

        { type: "separator" },
        {
          type: "checkbox",
          label: "Entire Course",
          checked: menuProps.previewMethod === "COURSE",
          click: () => handleAction("PREVIEW", "course"),
        },
      ],
    },

    {
      label: "Publish",
      enabled: menuProps.courseIsOpened,
      submenu: [
        {
          label: "Publish Course",
          click: () => handleAction("PUBLISH_SETTINGS"),
        },
        { type: "separator" },
        {
          label: "Quick Publish",
          click: () => handleAction("QUICK_PUBLISH"),
          enabled: false,
          accelerator: isMac ? "Cmd+P" : "Alt+P",
        },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Force Reload",
          click: () => handleAction("FORCE_RELOAD"),
          accelerator: isMac ? "Cmd+Shift+R" : "Alt+Shift+R",
        },
        {
          label: "Show Developer Tools",
          click: () => {
            console.log("DEV TOOLS");
            const mainWindow = BrowserWindow.getAllWindows()[0];
            mainWindow.webContents.openDevTools();
          },
          accelerator: isMac ? "Cmd+Alt+J" : "Alt+Shift+J",
        },
        { type: "separator" },
        {
          label: "Scrowl Website",
          click: () => {
            const { shell } = require("electron");
            shell.openExternal("https://scrowl.io");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = setMenu;
