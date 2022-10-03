import { arrayMoveMutable } from "array-move";
import { getNextLessonId, getLessonIndexById } from "./lessonHelper";
import { getNextSlideId } from "./slideHelper";

export function getModuleIndexById(state, id: number) {
  for (let i = 0; i < state.modules.length; i++) {
    if (state.modules[i].id === id) {
      return i;
    }
  }

  return -1;
}

export function getNextModuleId(state: { modules: string | any[] }) {
  let maxId = 0;

  for (let i = 0; i < state.modules.length; i++) {
    maxId = Math.max(maxId, state.modules[i].id);
  }

  return maxId + 1;
}

export function addNewLesson(state, module: { id: any }, lessonId: number) {
  const newLessonId = getNextLessonId(state);

  const newLesson = {
    id: newLessonId,
    moduleId: module.id,
    name: "Untitled Lesson",
  };

  // Add it to the end
  if (lessonId === -1) {
    state.lessons.push(newLesson);
    return;
  }

  const lessonIdIndex = getLessonIndexById(state, lessonId);
  state.lessons.splice(lessonIdIndex + 1, 0, newLesson);
}

export function deleteModule(state, module: { id: any }) {
  let selectedSlideWasDeleted = false;

  if (Object.keys(state.modules).length <= 1) {
    // Need at least one module
    return;
  }

  // Delete Slides
  state.slides = state.slides.filter(function (obj: { moduleId: any; id: any }) {
    if (obj.moduleId === module.id && obj.id === state.selectedSlideId) {
      selectedSlideWasDeleted = true;
    }
    return obj.moduleId !== module.id;
  });

  // Delete Lessons
  state.lessons = state.lessons.filter(function (obj: { moduleId: any }) {
    return obj.moduleId !== module.id;
  });

  // Delete Modules
  state.modules = state.modules.filter(function (obj: { id: any }) {
    return obj.id !== module.id;
  });

  if (selectedSlideWasDeleted) {
    state.selectedSlideId = -1;
    state.selectedSlideIndex = -1;
    state.selectedSlide = null;
  }
}

export function addNewModule(state, moduleId: number) {
  const newModuleId = getNextModuleId(state);

  console.log("addNewModule.addNewModule.addNewModule", moduleId);
  const newModule = {
    id: newModuleId,
    name: "Untitled Module " + newModuleId,
  };

  // Add it to the end
  if (moduleId === -1) {
    state.modules.push(newModule);
    return;
  }

  const moduleIdIndex = getModuleIndexById(state, moduleId);
  state.modules.splice(moduleIdIndex + 1, 0, newModule);
}

export function duplicateModule(state, module: { id: any }) {
  const newModuleId = getNextLessonId(state);
  let newLessonId = getNextLessonId(state);
  let newSlideId = getNextSlideId(state);

  const moduleIndex = getModuleIndexById(state, module.id);

  state.modules.splice(moduleIndex + 1, 0, {
    ...state.modules[moduleIndex],
    id: newModuleId,
  });

  let newLessons: any = [];
  let newSlides: any = [];
  state.lessons.forEach(function (lessonObj: any) {
    const lessonId = newLessonId++;
    if (lessonObj.moduleId === module.id) {
      newLessons.push({
        ...lessonObj,
        id: lessonId,
        moduleId: newModuleId,
      });

      state.slides.forEach(function (slideObj: any) {
        if (slideObj.lessonId === lessonObj.id) {
          newSlides.push({
            ...slideObj,
            id: newSlideId++,
            lessonId: lessonId,
          });
        }
      });
    }
  });

  state.lessons = state.lessons.concat(newLessons);
  state.slides = state.slides.concat(newSlides);
}

export function moveModule(state, from: { id: any }, to: { id: any }) {
  if (from.id === to.id) {
    console.log("No moved needed");
    return;
  }

  const fromModuleIndex = getModuleIndexById(state, from.id);
  const toModuleIndex = getModuleIndexById(state, to.id);

  if (fromModuleIndex < toModuleIndex) {
    arrayMoveMutable(state.modules, fromModuleIndex, toModuleIndex - 1);
  } else {
    arrayMoveMutable(state.modules, fromModuleIndex, toModuleIndex);
  }
}

export function _template(
  state: any,
  actionSlide: any,
  actionSlideIndex: any,
  module: any,
  lesson: any
) {}
