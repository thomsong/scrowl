import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ClientProxy from "../../../components/SlideRenderer/SlideHost/ClientProxy";
import { store } from "../..";
import { actions as uiActions, UI_MODE } from "../ui";

import {
  duplicateSlide,
  addSlideAfterSlide,
  moveSlideUp,
  moveSlideDown,
  deleteSlide,
  moveSlide,
  getSlideIndexById,
  getNextSlideId,
} from "./slideHelper";

import { moveLesson, getLessonIndexById, deleteLesson, duplicateLesson } from "./lessonHelper";
import {
  getModuleIndexById,
  addNewLesson,
  deleteModule,
  addNewModule,
  duplicateModule,
  moveModule,
} from "./moduleHelper";

const selectSlide = createAsyncThunk(
  //action type string
  "course/selectSlide",
  async (payload: any, thunkApi: any) => {
    const state = thunkApi.getState();

    // console.log("setSlideContent.setSlideContent.setSlideContent", payload, state);

    // console.log("templateLoaded", state.course.templateLoaded);

    if (state.course.templateLoaded) {
      // const validationResults: any = await ClientProxy.sendMessage("template.onValidate", {
      //   slide: state.course.selectedSlide,
      // });

      const validationResults = {};
      const layoutResult = await ClientProxy.sendMessage(
        "template.getContentLayout",
        state.course.selectedSlide
      );

      await ClientProxy.sendMessage("template.setLayoutState", layoutResult.state);

      return { validationResults, layoutResult };
    }

    return false;
  }
);

const setTemplateLoaded = createAsyncThunk(
  "course/setTemplateLoaded",
  async (payload: any, thunkApi: any) => {
    const state = thunkApi.getState();

    if (!state.course.templateLoaded) {
      const layoutResult = await ClientProxy.sendMessage("template.getContentLayout", payload);
      await ClientProxy.sendMessage("template.setLayoutState", layoutResult.state);
      return layoutResult;
    }

    return false;
  }
);

const validateSlideContent = createAsyncThunk(
  "course/validateSlideContent",
  async (payload: any, thunkApi: any) => {
    const state = thunkApi.getState();
    // console.log("setSlideContent.setSlideContent.setSlideContent", payload, state);

    const validationResults: any = await ClientProxy.sendMessage("template.onValidate", {
      slide: state.course.selectedSlide,
      passive: false,
    });

    const layoutResult = await ClientProxy.sendMessage(
      "template.getContentLayout",
      state.course.selectedSlide
    );

    await ClientProxy.sendMessage("template.setLayoutState", layoutResult.state);

    return { validationResults, layoutResult };
  }
);

const validateSlideContentFulfilled = (state, action: any) => {
  const { validationResults, layoutResult } = action.payload;

  state.contentLayout = layoutResult;

  const errors = {};
  const updates = {};

  // handle results
  Object.keys(validationResults).forEach((resultFieldKey: string) => {
    const result = validationResults[resultFieldKey];

    if (typeof result.value !== "undefined") {
      // Update value
      updates[resultFieldKey] = result.value;
    }

    if (result.error) {
      // Set error state
      errors[resultFieldKey] = result.error;
    }
  });

  const updateKeys = Object.keys(updates);
  if (updateKeys.length) {
    updateKeys.forEach((key) => {
      state.slides[state.selectedSlideIndex].content[key] = updates[key];
    });
  }

  if (
    Object.keys(errors).length ||
    (state.slides[state.selectedSlideIndex].validationErrors &&
      Object.keys(state.slides[state.selectedSlideIndex].validationErrors).length)
  ) {
    state.slides[state.selectedSlideIndex].validationErrors = errors;
    ClientProxy.sendMessage("template.setSlideValidationErrors", errors);
  }

  const validSlideContentValues = state.validSlideContentValues;
  Object.keys(validSlideContentValues).forEach((fieldName) => {
    if (errors[fieldName]) {
      // Error state
    } else {
      // Update it
      validSlideContentValues[fieldName] =
        state.slides[state.selectedSlideIndex].content[fieldName];
    }
  });

  state.validSlideContentValues = validSlideContentValues;
  state.selectedSlide = state.slides[state.selectedSlideIndex];
};

const revertSlideContentErrors = (state) => {
  if (!state.selectedSlide || !state.selectedSlide.validationErrors) {
    return;
  }

  Object.keys(state.selectedSlide.validationErrors).forEach((fieldName) => {
    state.slides[state.selectedSlideIndex].content[fieldName] =
      state.validSlideContentValues[fieldName];
  });

  state.slides[state.selectedSlideIndex].validationErrors = {};
};

const loadCourse = createAsyncThunk("course/loadCourse", async (newCourseId: any) => {
  return await (window as any).ScrowlApp.course.loadCourse(newCourseId);
});

const saveCourse = createAsyncThunk(
  "course/saveCourse",
  async (showNotification: boolean, thunkApi: any) => {
    const state = thunkApi.getState();

    if (!state.course.courseChanges) {
      return false;
    }

    console.log("loadCourse.saveCourse", state.course);

    const saveResult = await (window as any).ScrowlApp.course.saveCourse(state.course);

    if (showNotification) {
      new Notification("Save Successful", {
        body: "Scrowl course v" + saveResult.version + " was saved successfully",
      });
    }

    return saveResult;
  }
);

const closeCourse = createAsyncThunk("course/closeCourse", async (_, thunkApi: any) => {
  const state = thunkApi.getState();

  let dialogResult: any = { payload: { response: 1 } }; // Discard

  if (state.course.course.id && state.course.courseChanges) {
    dialogResult = await store.dispatch(
      uiActions.showDialog({
        buttons: ["Save Course", "Discard Changes", "Cancel"],
        defaultId: 0,
        message: "Close Course Without Saving?",
        detail: "Your changes are not saved.",
        type: "warning",
      })
    );
  }

  if (dialogResult.payload.response === 0) {
    // Save
    await store.dispatch(saveCourse(false));
    await store.dispatch(slice.actions.resetState());
    await store.dispatch(uiActions.setUIMode(UI_MODE.Courses));

    return true;
  } else if (dialogResult.payload.response === 1) {
    // Discard

    // If it's version 1, delete it it
    if (state.course.course.version === 1) {
      await (window as any).ScrowlApp.course.deleteEmptyCourse(state.course.course.id);
    }

    await store.dispatch(slice.actions.resetState());
    await store.dispatch(uiActions.setUIMode(UI_MODE.Courses));
    return true;
  }

  // Cancel
  return false;
});

const addNewAssets = createAsyncThunk(
  "course/addNewAssets",
  async (secureFileList: any, thunkApi: any) => {
    const state = thunkApi.getState();

    const courseId = String(state.course.course.id);
    // console.log("course/addNewAssets:: ", courseId, secureFileList);
    const assetResults = await (window as any).ScrowlApp.course.addNewAssets(
      courseId,
      secureFileList
    );

    // console.log("assetResults", assetResults);
    return assetResults;
  }
);

const publishCourse = createAsyncThunk(
  "course/publishCourse",
  async (payload: any, thunkApi: any) => {
    const state = thunkApi.getState();
    console.log("course/publishCourse", payload);
    if (!payload.courseId) {
      payload = {
        courseId: state.course.course.id,
        version: state.course.course.version,
      };
    }
    console.log("publishCourse", payload);

    return await (window as any).ScrowlApp.course.publishCourse(payload);
  }
);

// Define a type for the slice state
interface state {
  courseChanges: boolean;

  contentLayout: any;
  validSlideContentValues: any;

  selectedSlide: any | null;
  selectedSlideId: number;
  selectedSlideIndex: number;

  templateLoaded: boolean;
  contentPanelFocusField: string;

  course: {
    id: string | null;
    name: string;
    blueprint: string;
    version: number;
    createdBy: string;
    folder: string;
    tags: Array<string>;
    scrowlVer: string;
    dateCreated: number;
    lastSaved: number;
  };

  publish: {
    name: string;
    description: string;
    authors: string;
    organization: string;
    reportStatus: string;
    lmsIdentifier: string;
    outputFormat: string;
    optomizeMedia: string;
  };

  templates: any;

  assets: any;
  modules: any;
  lessons: any;
  slides: any;

  glossaryTerms: any;
  resources: any;
}

// Define the initial state using that type
const initialState: state = {
  courseChanges: false,

  contentLayout: {},
  validSlideContentValues: {},

  selectedSlide: null,
  selectedSlideId: -1,
  selectedSlideIndex: -1,

  templateLoaded: false,
  contentPanelFocusField: "",

  course: {
    id: null,
    name: "",
    blueprint: "",
    version: 0,
    createdBy: "",
    folder: "",
    tags: [],
    scrowlVer: "",
    dateCreated: 0,
    lastSaved: 0,
  },

  publish: {
    name: "",
    description: "",
    authors: "",
    organization: "",
    reportStatus: "Passed/Incomplete",
    lmsIdentifier: "",
    outputFormat: "SCORM 2004",
    optomizeMedia: "Recommended",
  },

  templates: [
    {
      key: "lesson-intro",
      version: "1.0",
      name: "Lesson Intro",
      icon: "Article",
    },
    {
      key: "simple-text",
      version: "1.0",
      name: "Simple Text",
      icon: "notes",
    },

    {
      key: "block-text",
      version: "1.0",
      name: "Text Block",
      icon: "vertical_split",
    },
    {
      key: "lottie-animation",
      version: "1.0",
      name: "Lottie Animation",
      icon: "animation",
    },
    {
      key: "quiz-question",
      version: "1.0",
      name: "Quiz Question",
      icon: "quiz",
    },
    {
      key: "demo-template",
      version: "1.0",
      name: "Globe",
      icon: "public",
    },

    {
      key: "sample-template",
      version: "1.0",
      name: "Sample Template",
      icon: "html",
      active: false,
    },
  ],

  assets: [],
  modules: [],
  lessons: [],
  slides: [],
  glossaryTerms: [],
  resources: [],
};

// initialState.selectedSlideIndex = 1;
// initialState.selectedSlide = initialState.slides[initialState.selectedSlideIndex];
// initialState.selectedSlideId = initialState.selectedSlide.id;

const slice = createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(addNewAssets.fulfilled, (state, action) => {
      console.log("addNewAssets.fulfilled", action);
    });

    builder.addCase(saveCourse.fulfilled, (state, action) => {
      state.course = { ...state.course, ...action.payload };
      state.courseChanges = false;
    });

    builder.addCase(loadCourse.fulfilled, (state, action: any) => {
      state = { ...initialState, ...action.payload };

      // Select first slide
      let firstSlideId = null;
      if (state.modules && state.modules.length) {
        state.modules.forEach((module: any) => {
          if (firstSlideId) {
            return;
          }

          state.lessons.forEach((lesson: any) => {
            if (firstSlideId) {
              return;
            }

            if (lesson.moduleId === module.id) {
              // This should be the first lesson

              state.slides.forEach((slide: any) => {
                if (firstSlideId) {
                  return;
                }

                if (slide.lessonId === lesson.id) {
                  firstSlideId = slide.id;
                }
              });
            }
          });
        });

        // get first module
        if (firstSlideId) {
          //console.log("firstModuleId", firstSlideId);
          state.selectedSlideId = firstSlideId;
          state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
          state.selectedSlide = state.slides[state.selectedSlideIndex];
        }
      }

      return state;
    });

    builder.addCase(selectSlide.pending, (state, action: any) => {
      // Revert error content on previous slide before continuing
      revertSlideContentErrors(state);

      state.contentLayout = {};
      state.templateLoaded = false;

      state.selectedSlideId = action.meta.arg;
      state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);

      if (!state.slides[state.selectedSlideIndex].validationErrors) {
        state.slides[state.selectedSlideIndex].validationErrors = {};
      }

      state.selectedSlide = state.slides[state.selectedSlideIndex];

      // TODO: replace with lodash clone???
      state.validSlideContentValues = { ...state.selectedSlide.content };
    });

    builder.addCase(selectSlide.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      return validateSlideContentFulfilled(state, action);
    });

    builder.addCase(setTemplateLoaded.fulfilled, (state, action: any) => {
      if (!action.payload) {
        return;
      }
      // console.log("setTemplateLoaded.fulfilled", action.payload);
      state.contentLayout = action.payload;
      state.templateLoaded = true;
    });

    builder.addCase(validateSlideContent.fulfilled, (state, action) => {
      return validateSlideContentFulfilled(state, action);
    });
  },

  reducers: {
    resetState: (state) => {
      state = initialState;
      return state;
    },

    deleteResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter((term: any) => term.id !== action.payload);
      state.courseChanges = true;
    },

    addNewResource: (state, action: PayloadAction<any>) => {
      const newResource = { ...action.payload };
      newResource.id =
        1 +
        state.resources.reduce((a: number, p: { id: number }) => {
          return p.id > a ? p.id : a;
        }, 0);

      state.resources.push(newResource);
      state.courseChanges = true;
    },

    updateResource: (state, action: PayloadAction<any>) => {
      for (let i = 0; i < state.resources.length; i++) {
        const term: any = state.resources[i];
        if (term.id === action.payload.id) {
          state.resources[i] = action.payload;
          state.courseChanges = true;
          return;
        }
      }
    },

    deleteTerm: (state, action: PayloadAction<string>) => {
      state.glossaryTerms = state.glossaryTerms.filter((term: any) => term.id !== action.payload);
      state.courseChanges = true;
    },

    addNewTerm: (state, action: PayloadAction<any>) => {
      const newGlossary = { ...action.payload };
      newGlossary.id =
        1 +
        state.glossaryTerms.reduce((a: number, p: { id: number }) => {
          return p.id > a ? p.id : a;
        }, 0);

      state.glossaryTerms.push(newGlossary);
      state.courseChanges = true;
    },

    updateTerm: (state, action: PayloadAction<any>) => {
      for (let i = 0; i < state.glossaryTerms.length; i++) {
        const term: any = state.glossaryTerms[i];
        if (term.id === action.payload.id) {
          state.glossaryTerms[i] = action.payload;
          state.courseChanges = true;
          return;
        }
      }
    },

    setSlideContent: (state, action: PayloadAction<any>) => {
      // console.log("action.payload", action.payload);
      state.slides[state.selectedSlideIndex].content[action.payload.fieldKey] =
        action.payload.value;

      state.selectedSlide = state.slides[state.selectedSlideIndex];
      state.courseChanges = true;

      ClientProxy.sendMessage("template.updateSlideContent", action.payload);
    },

    clearSlideSelected: (state) => {
      state.selectedSlide = null;
      state.selectedSlideId = -1;
      state.selectedSlideIndex = -1;

      state.contentLayout = {};
      state.validSlideContentValues = {};

      state.templateLoaded = false;
      state.contentPanelFocusField = "";
    },

    setContentPanelFocus: (state, action: PayloadAction<string>) => {
      state.contentPanelFocusField = action.payload;
    },

    setPublishSetting: (state, action: PayloadAction<any>) => {
      state.publish[action.payload.key] = action.payload.value;
      state.courseChanges = true;
    },

    setCourseName: (state, action: PayloadAction<string>) => {
      state.course.name = action.payload;
      state.courseChanges = true;
    },

    setSlideNotes: (state, action: PayloadAction<string>) => {
      state.slides[state.selectedSlideIndex].slideNotes = action.payload;
      state.selectedSlide = state.slides[state.selectedSlideIndex];
      state.courseChanges = true;
    },

    setSlideName: (state, action: PayloadAction<string | { id: number; name: string }>) => {
      if (typeof action.payload === "string") {
        state.slides[state.selectedSlideIndex].name = action.payload;
      } else {
        const slideIndex = getSlideIndexById(state, action.payload.id);
        state.slides[slideIndex].name = action.payload.name;
      }

      state.selectedSlide = state.slides[state.selectedSlideIndex];
      state.courseChanges = true;
    },

    setSlideTemplate: (state, action: PayloadAction<any>) => {
      const { templateName, templateVersion } = action.payload;

      state.slides[state.selectedSlideIndex].templateName = templateName;
      state.slides[state.selectedSlideIndex].templateVersion = templateVersion;

      state.selectedSlide = state.slides[state.selectedSlideIndex];
      state.courseChanges = true;
    },

    setLessonName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const lessonsIndex = getLessonIndexById(state, action.payload.id);
      state.lessons[lessonsIndex].name = action.payload.name;
      state.courseChanges = true;
    },

    setModuleName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const moduleIndex = getModuleIndexById(state, action.payload.id);
      state.modules[moduleIndex].name = action.payload.name;
      state.courseChanges = true;
    },

    moveSlide: (state, action: PayloadAction<any>) => {
      moveSlide(state, action.payload.from, action.payload.to);
      state.courseChanges = true;
    },

    moveLesson: (state, action: PayloadAction<any>) => {
      moveLesson(state, action.payload.from, action.payload.to);
      state.courseChanges = true;
    },

    moveModule: (state, action: PayloadAction<any>) => {
      moveModule(state, action.payload.from, action.payload.to);
      state.courseChanges = true;
    },

    handleSlideAction: (state, action: PayloadAction<any>) => {
      console.log("course::Handle Slide Action", action.payload);

      const actionSlide = action.payload.id
        ? state.slides.find((obj: { id: any }) => {
            return obj.id === action.payload.id;
          })
        : state.selectedSlide;

      if (!action.payload.id && !actionSlide) {
        return;
      }

      const actionSlideIndex = getSlideIndexById(state, actionSlide.id);

      const lesson = state.lessons.find((obj: { id: any }) => {
        return obj.id === actionSlide.lessonId;
      });

      const module = state.modules.find((obj: { id: any }) => {
        return obj.id === actionSlide.moduleId;
      });

      switch (action.payload.action) {
        case "add_slide_after":
          addSlideAfterSlide(state, actionSlide, actionSlideIndex, module, lesson);
          break;

        case "duplicate":
          duplicateSlide(state, actionSlide, actionSlideIndex, module, lesson);
          break;

        case "delete":
          deleteSlide(state, actionSlide, actionSlideIndex, module, lesson);
          break;

        case "move_up":
          moveSlideUp(state, actionSlide, actionSlideIndex, module, lesson);
          break;

        case "move_down":
          moveSlideDown(state, actionSlide, actionSlideIndex, module, lesson);
          break;

        default:
          console.log("Unhandled course::Handle Slide Action", action.payload.action);
      }

      state.courseChanges = true;
    },

    handleLessonAction: (state, action: PayloadAction<any>) => {
      console.log("course::Handle Lesson Action", action.payload);

      const lesson: any = action.payload.id
        ? state.lessons.find((obj: { id: any }) => {
            return obj.id === action.payload.id;
          })
        : state.lessons.find((obj: { id: any }) => {
            return obj.id === state.selectedSlide.lessonId;
          });

      if (!action.payload.id && !lesson) {
        return;
      }

      const module = state.modules.find((obj: { id: any }) => {
        return obj.id === lesson.moduleId;
      });

      console.log("lesson", lesson);
      switch (action.payload.action) {
        case "add_new_slide":
          console.log("add_new_slide", action.payload);

          const newSlideId = getNextSlideId(state) + 1;
          state.slides.push({
            id: newSlideId,
            moduleId: module.id,
            lessonId: lesson.id,
            name: "Untitled Slide",
            templateName: "simple-text",
            templateVersion: "1.0",
            content: {},
          });

          state.selectedSlideId = newSlideId;
          state.selectedSlideIndex = getSlideIndexById(state, newSlideId);
          state.selectedSlide = state.slides[state.selectedSlideIndex];
          break;

        case "delete":
          deleteLesson(state, module, lesson);
          break;

        case "duplicate":
          duplicateLesson(state, module, lesson);
          break;

        case "add_new_lesson_after":
          addNewLesson(state, module, lesson.id);
          break;

        default:
          console.log("Unhandled course::Handle Lesson Action", action.payload.action);
      }

      state.courseChanges = true;
    },

    handleModuleAction: (state, action: PayloadAction<any>) => {
      console.log("course::Handle Module Action", action.payload);

      let module: any = action.payload.id
        ? state.modules.find((obj: { id: any }) => {
            return obj.id === action.payload.id;
          })
        : state.modules[0];

      switch (action.payload.action) {
        case "add_new_lesson":
          addNewLesson(state, module, -1);
          break;

        case "delete":
          deleteModule(state, module);
          break;

        case "duplicate":
          duplicateModule(state, module);
          break;

        case "add_new_module":
          console.log("ZZZZZZZZZZZZZZZZ");
          addNewModule(state, -1);
          break;

        case "add_new_module_after":
          addNewModule(state, module.id);
          break;

        default:
          console.log("Unhandled course::Handle Module Action", action.payload.action);
      }

      state.courseChanges = true;
    },

    handleCopyAssetComplete: (state, action: PayloadAction<any>) => {
      console.log("handleCopyAssetComplete", action.payload);
      const addedAssets: any = action.payload;

      let newAssetState = state.assets.filter(
        (asset: { fileHash: string | number }) => !addedAssets[asset.fileHash]
      );

      Object.keys(addedAssets).forEach((fileHash) => {
        newAssetState.push(addedAssets[fileHash]);
      });

      state.assets = newAssetState;
      state.courseChanges = true;
    },
  },
});

export const actions = {
  ...slice.actions,
  selectSlide,
  setTemplateLoaded,
  validateSlideContent,
  loadCourse,
  closeCourse,
  saveCourse,
  addNewAssets,
  publishCourse,
};
export default slice.reducer;
