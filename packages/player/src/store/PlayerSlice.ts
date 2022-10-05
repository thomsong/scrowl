import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const _window = window as any;

interface state {
  sideBarExpanded: boolean;
  selectedLessonId: number;
  slideMode: boolean;
}

const courseState = (window as any).courseData;
let firstModuleId = courseState.modules[0].id;

if (_window.courseData.preview.moduleId) {
  firstModuleId = _window.courseData.preview.moduleId;
}

let firstLessonId = courseState.lessons.reduce((a, p) => {
  return p.moduleId === firstModuleId && a === -1 ? p.id : a;
}, -1);

if (_window.courseData.preview.lessonId) {
  firstLessonId = _window.courseData.preview.lessonId;
}

const initialState: state = {
  sideBarExpanded: false,
  selectedLessonId: firstLessonId,
  slideMode: false,
};

const PlayerSlice = createSlice({
  name: "player",
  initialState,

  reducers: {
    openSidePanel: (state) => {
      state.sideBarExpanded = true;
    },

    closeSidePanel: (state) => {
      state.sideBarExpanded = false;
    },

    selectLesson: (state, action: PayloadAction<number>) => {
      state.selectedLessonId = action.payload;
    },

    setSlideMode: (state, action: PayloadAction<boolean>) => {
      state.slideMode = action.payload;
    },
  },
});

export const actions = PlayerSlice.actions;
export default PlayerSlice.reducer;
