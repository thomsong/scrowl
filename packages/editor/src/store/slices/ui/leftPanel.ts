import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface state {
  selectedTab: string;

  slideFocusTS: number;

  expandedOutlineModules: Array<number>;
  expandedOutlineLessons: Array<number>;

  searchTerm: string;

  editSlideNameId: number;
  editLessonNameId: number;
  editModuleNameId: number;
}

// Define the initial state using that type
const initialState: state = {
  selectedTab: "Outline",

  slideFocusTS: 0,

  expandedOutlineModules: [],
  expandedOutlineLessons: [],

  searchTerm: "",

  editSlideNameId: -1,
  editLessonNameId: -1,
  editModuleNameId: -1,
};

const slice = createSlice({
  name: "leftPanel",
  initialState,
  reducers: {
    // Panel
    setPanelTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    },

    // Search
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    // Outline
    toggleOutlineItemExpanded: (state, action: PayloadAction<any>) => {
      const payloadId: number = action.payload.id;

      if (action.payload.type === "module") {
        if (state.expandedOutlineModules.indexOf(payloadId) !== -1) {
          // Remove
          state.expandedOutlineModules = state.expandedOutlineModules.filter(
            (id) => id !== payloadId
          );
        } else {
          // Add
          state.expandedOutlineModules.push(payloadId);
        }
      } else {
        // Lesson

        if (state.expandedOutlineLessons.indexOf(payloadId) !== -1) {
          // Remove
          state.expandedOutlineLessons = state.expandedOutlineLessons.filter(
            (id) => id !== payloadId
          );
        } else {
          // Add
          state.expandedOutlineLessons.push(payloadId);
        }
      }
    },

    focusOnSlide: (state, action: PayloadAction<any>) => {
      const slide: any = action.payload;
      if (!slide) {
        return;
      }

      state.slideFocusTS = Math.floor(performance.now() * 10);

      // Expand Module
      if (state.expandedOutlineModules.indexOf(slide.moduleId) === -1) {
        state.expandedOutlineModules.push(slide.moduleId);
      }

      if (state.expandedOutlineLessons.indexOf(slide.lessonId) === -1) {
        state.expandedOutlineLessons.push(slide.lessonId);
      }
    },

    ////////////////////
    // Dropdown Menus
    handleSlideAction: (state, action: PayloadAction<any>) => {
      switch (action.payload.action) {
        case "rename":
          state.editSlideNameId = action.payload.id;
          break;

        default:
          break;
      }
    },

    clearEditMode: (state) => {
      state.editSlideNameId = -1;
      state.editLessonNameId = -1;
      state.editModuleNameId = -1;
    },

    handleLessonAction: (state, action: PayloadAction<any>) => {
      switch (action.payload.action) {
        case "rename":
          state.editLessonNameId = action.payload.id;
          break;

        default:
          break;
      }
    },

    handleModuleAction: (state, action: PayloadAction<any>) => {
      switch (action.payload.action) {
        case "rename":
          state.editModuleNameId = action.payload.id;
          break;

        default:
          break;
      }
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;
