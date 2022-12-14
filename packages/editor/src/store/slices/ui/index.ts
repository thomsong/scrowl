import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { store } from "../..";
import { actions as courseActions } from "../course";
import { actions as leftPanelActions } from "./leftPanel";

export enum PREVIEW_MODE {
  default = "default",
  slide = "slide",
  lesson = "lesson",
  module = "module",
  course = "course",
}

export enum RATIO_SIZE {
  Fit = "FIT",
  Wide_16_9 = "16:9",
}

export enum UI_MODE {
  Startup,
  Loading,
  Ready,
  //
  FirstWelcome,
  Courses,
  Designer,
}

interface state {
  mode: UI_MODE;
  darkMode: boolean;
  workspaceRatioSize: RATIO_SIZE;
  showSlideNotes: boolean;
  reducedAnimations: boolean;
  animationDelay: number;
  previewMode: PREVIEW_MODE;
  copyAssetProgress:
    | {
        filename: string;
        progress: number;
        totalProgress: number;
      }
    | boolean;
  overlays: any;
}

let callbackIndex = 1;
let overlayCallbacks = {};

// Define the initial state using that type
const initialState: state = {
  mode: UI_MODE.Startup,

  darkMode: false,
  workspaceRatioSize: RATIO_SIZE.Fit,

  reducedAnimations: false, //true,
  animationDelay: 0, //0.3,
  showSlideNotes: false,

  previewMode: PREVIEW_MODE.course,
  // copyAssetProgress: {
  //   filename: "all_tasks.csv",
  //   progress: 72,
  //   totalProgress: 39,
  // },
  copyAssetProgress: false,
  overlays: [
    // {
    //   mode: "Resource",
    //   data: { id: 3 },
    // },
    // {
    //   mode: "AssetBrowser",
    //   data: {},
    // },
    // {
    //   mode: "Publish",
    //   data: {},
    // },
    // {
    //   mode: "FirstPublish",
    //   data: {},
    // },
  ],
};

const initUI = createAsyncThunk(
  //action type string
  "ui/initUI",
  async () => {
    const _window = window as any;
    _window.nativeTheme = await _window.ScrowlApp.getNativeTheme();
    _window.prefersReducedMotion = _window.ScrowlApp.prefersReducedMotion();

    (async () => {
      const htmlRoot = document.getElementsByTagName("html")[0];

      // Prevent infinite loop
      let loopCount = 0;
      while (loopCount++ < 100) {
        if (_window.nativeTheme.shouldUseHighContrastColors) {
          htmlRoot.classList.add("high-contrast");
        } else {
          htmlRoot.classList.remove("high-contrast");
        }

        if (false && _window.nativeTheme.shouldUseDarkColors) {
          // This will be used for future dark-theme
          htmlRoot.classList.add("dark");
          htmlRoot.classList.remove("light");
        } else {
          htmlRoot.classList.add("light");
          htmlRoot.classList.remove("dark");
        }

        // This will wait here until there is a change... maybe forever
        _window.nativeTheme = await _window.ScrowlApp.listenForThemeUpdate();

        _window.prefersReducedMotion = await _window.ScrowlApp.prefersReducedMotion();
      }
    })();

    return true;
  }
);

const launchPreview = createAsyncThunk(
  // Action type string
  "ui/launchPreview",
  async (mode: any, thunkApi: any) => {
    await store.dispatch(courseActions.saveCourse(false));

    const state = thunkApi.getState();

    const previewMode = state.ui.previewMode;
    const payload: any = { previewMode };

    payload.course = state.course.course;
    payload.publish = state.course.publish;

    if (state.course.selectedSlide) {
      payload.slideId = state.course.selectedSlide.id;
      payload.lessonId = state.course.selectedSlide.lessonId;
      payload.moduleId = state.course.selectedSlide.moduleId;
    }

    await (window as any).ScrowlApp.showPreview(payload);

    // Preview done & closed
  }
);

const showDialog = createAsyncThunk(
  //action type string
  "ui/selectSlide",
  async (payload: any, thunkApi: any) => {
    return await (window as any).ScrowlApp.dialog.show(payload);
  }
);

const handleGlobalAction = createAsyncThunk(
  //action type string
  "ui/handleGlobalAction",
  async (payload: any, thunkApi: any) => {
    const state = thunkApi.getState();

    const actionId = payload.id || false;
    if (!actionId) {
      return;
    }

    const selectedSlide: any = state.course.selectedSlide;

    switch (actionId.toUpperCase()) {
      case "COPY_ASSET_PROGRESS":
        store.dispatch(slice.actions.updateCopyAssetProgress(payload.args));

        break;
      case "COPY_ASSET_COMPLETE":
        store.dispatch(courseActions.handleCopyAssetComplete(payload.args));
        store.dispatch(slice.actions.updateCopyAssetProgress(false));

        new Notification("Add New File", {
          body:
            (Object.keys(payload.args).length === 1 ? "File was " : "Files were ") +
            "added successfully",
        });

        break;

      case "CLOSE_WINDOW":
        const closeResult: any = await store.dispatch(courseActions.closeCourse());

        if (closeResult.payload === false) {
          // CANCEL
          return;
        } else {
          window.close();
        }
        break;

      case "CLOSE_COURSE":
        store.dispatch(courseActions.closeCourse());
        break;

      // Opening requires closing first
      case "OPEN_COURSE":
        store.dispatch(courseActions.closeCourse());
        break;

      case "SAVE":
        store.dispatch(courseActions.saveCourse(true));
        break;

      case "NEW_COURSE":
        if (
          state.course.course.id &&
          !state.course.courseChanges &&
          state.course.course.version === 1
        ) {
          return;
        }

        if (state.course.course.id) {
          const result: any = await store.dispatch(courseActions.closeCourse());

          if (result.payload === false) {
            // Cancel
            return;
          } else {
            // Course closed successfully
          }
        }

        const result = await (window as any).ScrowlApp.course.newCourse("new-default");
        await store.dispatch(courseActions.loadCourse(result.id));
        store.dispatch(slice.actions.setUIMode(UI_MODE.Designer));
        break;

      case "PUBLISH_SETTINGS":
        const publishAlreadyOpen = (state.ui.overlays || []).reduce((a, p) => {
          return p.mode === "Publish" ? true : a;
        }, false);

        if (!publishAlreadyOpen) {
          store.dispatch(
            showOverlay({
              type: "Publish",
              data: {},
            })
          );
        }

        break;
      case "PREVIEW":
        const previewType = payload.args;
        store.dispatch(launchPreview(previewType));
        break;

      case "DUPLICATE_SLIDE":
        store.dispatch(
          courseActions.handleSlideAction({
            action: "duplicate",
          })
        );
        break;
      case "DELETE_SLIDE":
        if (selectedSlide) {
          const dialogResult = await store.dispatch(
            showDialog({
              buttons: ["Delete Slide", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: selectedSlide.name,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            store.dispatch(
              courseActions.handleSlideAction({
                action: "delete",
              })
            );
          }
        }

        break;
      case "RENAME_SLIDE":
        if (selectedSlide) {
          store.dispatch(
            leftPanelActions.handleSlideAction({
              action: "rename",
              id: selectedSlide.id,
            })
          );
        }
        break;

      case "ADD_NEW":
        switch (payload.args) {
          case "slide":
            store.dispatch(
              courseActions.handleLessonAction({
                action: "add_new_slide",
              })
            );
            break;
          case "lesson":
            store.dispatch(
              courseActions.handleModuleAction({
                action: "add_new_lesson",
              })
            );
            break;
          case "module":
            store.dispatch(
              courseActions.handleModuleAction({
                action: "add_new_module",
              })
            );
            break;
        }

        break;
      case "FORCE_RELOAD":
        window.location.reload();
        break;
      default:
        console.error("UI::Unhandled Global Action", payload);
    }
  }
);

const showOverlay = createAsyncThunk("ui/showOverlay", async (payload: any, thunkApi: any) => {
  let callbackId = 0;

  if (payload.callback) {
    callbackId = callbackIndex++;
    overlayCallbacks[callbackId] = payload.callback;
  }

  const newOverlay = {
    mode: payload.type,
    data: payload.data,
    callbackId,
  };

  return newOverlay;
});

const slice = createSlice({
  name: "ui",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(launchPreview.pending, (state, action: any) => {
      if (action.meta.arg !== PREVIEW_MODE.default && action.meta.arg !== state.previewMode) {
        state.previewMode = action.meta.arg;
      }
    });

    builder.addCase(showOverlay.fulfilled, (state, action) => {
      state.overlays.push(action.payload);
    });

    builder.addCase(showDialog.pending, (state, action: any) => {
      const newOverlay = {
        mode: "dialog",
      };

      state.overlays.push(newOverlay);
    });
    builder.addCase(showDialog.fulfilled, (state, action) => {
      state.overlays.pop();
    });
  },

  reducers: {
    updateCopyAssetProgress: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.copyAssetProgress = false;
      } else {
        state.copyAssetProgress = action.payload;
      }
    },

    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },

    setWorkspaceRatioSize: (state, action: PayloadAction<RATIO_SIZE>) => {
      state.workspaceRatioSize = action.payload;
    },

    closeOverlay: (state, action: PayloadAction<any>) => {
      const overlay = state.overlays.pop();

      if (overlay.callbackId && overlayCallbacks[overlay.callbackId]) {
        const callbackFunc = overlayCallbacks[overlay.callbackId];
        delete overlayCallbacks[overlay.callbackId];

        callbackFunc(action && action.payload);
      }

      if (!state.overlays.length) {
        // Cleanup old callback refs
        overlayCallbacks = {};
      }
    },

    createFirstCourse: (state) => {
      state.mode = UI_MODE.Designer;
    },

    setUIMode: (state, action: PayloadAction<UI_MODE>) => {
      if (state.mode === UI_MODE.Loading) {
        state.reducedAnimations = false; //(window as any).prefersReducedMotion ? true : false;
      }

      state.mode = action.payload;
    },

    setSlideNoteVisibility: (state, action: PayloadAction<boolean>) => {
      state.showSlideNotes = action.payload;
    },
  },
});

export const actions = {
  ...slice.actions,
  showDialog,
  handleGlobalAction,
  showOverlay,
  launchPreview,
  initUI,
};
export default slice.reducer;
