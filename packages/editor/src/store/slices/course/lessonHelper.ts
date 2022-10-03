import { arrayMoveMutable } from "array-move";
import { getNextSlideId } from "./slideHelper";

export function getNextLessonId(state: { lessons: string | any[] }) {
  let maxId = 0;

  for (let i = 0; i < state.lessons.length; i++) {
    maxId = Math.max(maxId, state.lessons[i].id);
  }

  return maxId + 1;
}

export function getLessonIndexById(state, id: number) {
  for (let i = 0; i < state.lessons.length; i++) {
    if (state.lessons[i].id === id) {
      return i;
    }
  }

  return -1;
}

export function moveLesson(state, from: { id: any; module: any }, to: { id: any; module: any }) {
  console.log("moveLesson.moveLesson", from, to);

  if (from.id === to.id && from.module === to.module) {
    console.log("No moved needed");
    return;
  }

  const fromLessonIndex = getLessonIndexById(state, from.id);
  const toLessonIndex = getLessonIndexById(state, to.id);

  console.log("fromLessonIndex", fromLessonIndex);
  console.log("toLessonIndex", toLessonIndex);

  state.lessons[fromLessonIndex].moduleId = to.module;

  if (fromLessonIndex < toLessonIndex) {
    arrayMoveMutable(state.lessons, fromLessonIndex, toLessonIndex - 1);
  } else {
    arrayMoveMutable(state.lessons, fromLessonIndex, toLessonIndex);
  }
}

export function deleteLesson(state, module: any, lesson: { id: any }) {
  console.log("deleteLesson.deleteLesson", lesson.id);

  // Remove all slides in this lesson
  // state.slides.splice(actionSlideIndex, 1);

  let selectedSlideWasDeleted = false;
  state.slides = state.slides.filter(function (obj: { lessonId: any; id: any }) {
    if (obj.lessonId === lesson.id && obj.id === state.selectedSlideId) {
      selectedSlideWasDeleted = true;
    }
    return obj.lessonId !== lesson.id;
  });

  state.lessons = state.lessons.filter(function (obj: { id: any }) {
    return obj.id !== lesson.id;
  });

  if (selectedSlideWasDeleted) {
    state.selectedSlideId = -1;
    state.selectedSlideIndex = -1;
    state.selectedSlide = null;
  }
}

export function duplicateLesson(state, module: any, lesson: { id: any }) {
  const newLessonId = getNextLessonId(state);
  const lessonIndex = getLessonIndexById(state, lesson.id);

  state.lessons.splice(lessonIndex + 1, 0, {
    ...state.lessons[lessonIndex],
    id: newLessonId,
  });

  // Duplicate the slides
  let newSlideId = getNextSlideId(state);

  let newSlides: any = [];
  state.slides.forEach(function (obj: any) {
    if (obj.lessonId === lesson.id) {
      newSlides.push({
        ...obj,
        id: newSlideId++,
        lessonId: newLessonId,
      });
    }
  });

  state.slides = state.slides.concat(newSlides);
}

export function _template(
  state: any,
  actionSlide: any,
  actionSlideIndex: any,
  module: any,
  lesson: any
) {}
