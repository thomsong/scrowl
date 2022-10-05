import { store } from "../../";
import { actions as leftPanelActions } from "./leftPanel";
import ClientProxy from "./../../../components/SlideRenderer/SlideHost/ClientProxy";

const init = function () {
  window.requestAnimationFrame(() => {
    store.subscribe(handleChange);
  });
};

const currentAppMenuOptions = {
  courseIsOpened: false,
  slideSelected: false,
  previewMethod: "",
  recentCourses: [],
};

function updateAppToolbar(state): void {
  let menuChanged = false;

  const courseIsOpened = state.course.course.id ? true : false;
  if (currentAppMenuOptions.courseIsOpened !== courseIsOpened) {
    currentAppMenuOptions.courseIsOpened = courseIsOpened;
    menuChanged = true;

    if (courseIsOpened) {
      (window as any).ScrowlApp.course.setActiveCourse(state.course.course.id);
    } else {
      ClientProxy.closeConnection();
      (window as any).ScrowlApp.course.clearActiveCourse();
    }
  }

  const slideSelected = state.course.selectedSlideId >= 0;
  if (currentAppMenuOptions.slideSelected !== slideSelected) {
    currentAppMenuOptions.slideSelected = slideSelected;
    menuChanged = true;
  }

  const previewMethod = state.ui.previewMode.toUpperCase();
  if (currentAppMenuOptions.previewMethod !== previewMethod) {
    currentAppMenuOptions.previewMethod = previewMethod;
    menuChanged = true;
  }

  if (menuChanged) {
    (window as any).ScrowlApp.updateAppMenu(currentAppMenuOptions);
  }
}

let previousSelectedSlideId: any;
function handleChange() {
  let currentState = store.getState();
  if (
    currentState.course.selectedSlide &&
    currentState.course.selectedSlide.id !== previousSelectedSlideId
  ) {
    previousSelectedSlideId = currentState.course.selectedSlide.id;
    store.dispatch(leftPanelActions.focusOnSlide(currentState.course.selectedSlide));
  }

  updateAppToolbar(currentState);
}

export default init;
