import { arrayMoveMutable } from "array-move";

export function getSlideIndexById(state, id: number) {
  for (let i = 0; i < state.slides.length; i++) {
    if (state.slides[i].id === id) {
      return i;
    }
  }

  return -1;
}

export function getNextSlideIndexByLessonId(
  state: { slides: string | any[] },
  startingIndex: number,
  lessonId: any
) {
  for (let i = startingIndex + 1; i < state.slides.length; i++) {
    if (state.slides[i].lessonId === lessonId) {
      return i;
    }
  }

  return -1;
}

export function getPrevSlideIndexByLessonId(
  state: { slides: { lessonId: any }[] },
  startingIndex: number,
  lessonId: any
) {
  for (let i = startingIndex - 1; i >= 0; i--) {
    if (state.slides[i].lessonId === lessonId) {
      return i;
    }
  }

  return -1;
}

export function getNextSlideId(state) {
  let maxId = 0;

  for (let i = 0; i < state.slides.length; i++) {
    maxId = Math.max(maxId, state.slides[i].id);
  }

  return maxId + 1;
}

export function duplicateSlide(
  state,
  actionSlide: any,
  actionSlideIndex: number,
  module: any,
  lesson: any
) {
  const newSlideId = getNextSlideId(state);

  state.slides.splice(actionSlideIndex + 1, 0, {
    ...state.slides[actionSlideIndex],
    id: newSlideId,
  });

  state.selectedSlideId = newSlideId;
  state.selectedSlideIndex = getSlideIndexById(state, newSlideId);
  state.selectedSlide = state.slides[state.selectedSlideIndex];
}

export function addSlideAfterSlide(
  state,
  actionSlide: any,
  actionSlideIndex: number,
  module: { id: any },
  lesson: { id: any }
) {
  const newSlideId = getNextSlideId(state);

  state.slides.splice(actionSlideIndex + 1, 0, {
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

  return newSlideId;
}

export function moveSlideUp(
  state,
  actionSlide: any,
  actionSlideIndex: number,
  module: any,
  lesson: { id: any }
) {
  // Find next lesson slide index
  const prevSlideIndex = getPrevSlideIndexByLessonId(state, actionSlideIndex, lesson.id);
  if (prevSlideIndex === -1) {
    return;
  }

  arrayMoveMutable(state.slides, actionSlideIndex, prevSlideIndex);

  state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
  state.selectedSlide = state.slides[state.selectedSlideIndex];
}
export function moveSlideDown(
  state,
  actionSlide: any,
  actionSlideIndex: number,
  module: any,
  lesson: { id: any }
) {
  // Find next lesson slide index
  const nextSlideIndex = getNextSlideIndexByLessonId(state, actionSlideIndex, lesson.id);
  if (nextSlideIndex === -1) {
    return;
  }

  arrayMoveMutable(state.slides, actionSlideIndex, nextSlideIndex);

  state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
  state.selectedSlide = state.slides[state.selectedSlideIndex];
}

export function deleteSlide(
  state,
  actionSlide: any,
  actionSlideIndex: number,
  module: any,
  lesson: { id: any }
) {
  let nextFocusSlideId = -1;
  let nextFocusSlideIndex = -1;

  if (actionSlideIndex === state.selectedSlideIndex) {
    // We  need to select a new slide
    nextFocusSlideIndex = getPrevSlideIndexByLessonId(state, actionSlideIndex, lesson.id);
    if (nextFocusSlideIndex === -1) {
      nextFocusSlideIndex = getNextSlideIndexByLessonId(state, actionSlideIndex, lesson.id);
    }

    if (nextFocusSlideIndex > -1) {
      nextFocusSlideId = state.slides[nextFocusSlideIndex].id;
    }
  }

  state.slides.splice(actionSlideIndex, 1);

  if (nextFocusSlideId === -1) {
    // No need to switch selection

    state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
    state.selectedSlide = state.slides[state.selectedSlideIndex];
  } else {
    state.selectedSlideId = nextFocusSlideId;
    state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
    state.selectedSlide = state.slides[state.selectedSlideIndex];
  }
}

export function moveSlide(
  state,
  from: { id: any; module: any; lesson: any },
  to: { id: any; module: any; lesson: any }
) {
  if (from.id === to.id && from.module === to.module && from.lesson === to.lesson) {
    // No moved needed
    return;
  }

  const fromSlideIndex = getSlideIndexById(state, from.id);
  const toSlideIndex = getSlideIndexById(state, to.id);

  state.slides[fromSlideIndex].moduleId = to.module;
  state.slides[fromSlideIndex].lessonId = to.lesson;

  if (fromSlideIndex < toSlideIndex) {
    arrayMoveMutable(state.slides, fromSlideIndex, toSlideIndex - 1);
  } else {
    arrayMoveMutable(state.slides, fromSlideIndex, toSlideIndex);
  }

  state.selectedSlideIndex = getSlideIndexById(state, state.selectedSlideId);
  state.selectedSlide = state.slides[state.selectedSlideIndex];
}

export function _template(
  state: any,
  actionSlide: any,
  actionSlideIndex: any,
  module: any,
  lesson: any
) {}
