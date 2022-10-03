import { useRef, useLayoutEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as leftPanelActions } from "./../../store/slices/ui/leftPanel";
import { motion } from "framer-motion";

function GlobalStatusBar() {
  const dispatch = useAppDispatch();

  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const modules: any = useAppSelector((state) => state["course"].modules);
  const lessons: any = useAppSelector((state) => state["course"].lessons);
  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;

      dispatch(leftPanelActions.focusOnSlide(selectedSlide));
    }
  });

  const module = selectedSlide
    ? modules.find((obj) => {
        return obj.id === selectedSlide.moduleId;
      })
    : null;

  const lesson = selectedSlide
    ? lessons.find((obj) => {
        return obj.id === selectedSlide.lessonId;
      })
    : null;

  return (
    <motion.nav
      className="scrowl__footer navbar fixed-bottom"
      aria-label="breadcrumb"
      style={reducedAnimations ? {} : { transform: "translate(0,32px)" }}
      initial={reducedAnimations ? {} : { transform: "translate(0,32px)" }}
      animate={
        reducedAnimations
          ? {}
          : { transform: "translate(0,0px)", transition: { delay: animationDelay, duration: 0.4 } }
      }
    >
      {selectedSlide ? (
        <ol id="scrowlSelection" className="breadcrumb scrowl__footer__breadcrumb">
          <li className="breadcrumb-item">
            <button className="breadcrumb-item__content" disabled>
              <span className="material-symbols-sharp color-module">folder</span>
              {module ? module.name : ""}
            </button>
          </li>
          <li className="breadcrumb-item">
            <button className="breadcrumb-item__content" disabled>
              <span className="material-symbols-sharp color-lesson">interests</span>
              {lesson ? lesson.name : ""}
            </button>
          </li>
          <li className="breadcrumb-item active dropup" aria-current="page">
            <button
              className="breadcrumb-item__content dropdown-toggle"
              onClick={(e: any) => {
                // TODO; Move cursor focus to the slide
                dispatch(leftPanelActions.focusOnSlide(selectedSlide));
              }}
              onContextMenu={(e: any) => {
                // TODO; Move cursor focus to the slide
                e.target.blur();
                dispatch(leftPanelActions.focusOnSlide(selectedSlide));
              }}
            >
              <span className="material-symbols-outlined color-slide">rectangle</span>
              {selectedSlide ? selectedSlide.name : ""}
            </button>
          </li>
        </ol>
      ) : (
        <ol id="scrowlSelection" className="breadcrumb scrowl__footer__breadcrumb">
          <li className="breadcrumb-item active dropup" aria-current="page">
            <button
              className="breadcrumb-item__content dropdown-toggle"
              style={{
                textDecoration: "none",
                pointerEvents: "none",
              }}
            >
              <span className="material-symbols-outlined color-slide">rectangle</span>
              No slide selected...
            </button>
          </li>
        </ol>
      )}
      {/* <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          id={"status_bar:" + RATIO_SIZE.Wide_16_9}
          checked={workspaceRatioSize === RATIO_SIZE.Wide_16_9 ? true : false}
          onChange={(e) => {
            // console.log("e.target.checked 1", e.target.checked);
            dispatch(uiActions.setWorkspaceRatioSize(RATIO_SIZE.Wide_16_9));
          }}
        />
        <label
          className="form-check-label scrowl__footer__label"
          htmlFor={"status_bar:" + RATIO_SIZE.Wide_16_9}
        >
          16:9
        </label>
      </div>
      <div className="form-check form-check-inline me-3">
        <input
          className="form-check-input"
          type="radio"
          id={"status_bar:" + RATIO_SIZE.Fit}
          checked={workspaceRatioSize === RATIO_SIZE.Fit ? true : false}
          onChange={(e) => {
            // console.log("e.target.checked 2", e.target.checked);
            dispatch(uiActions.setWorkspaceRatioSize(RATIO_SIZE.Fit));
          }}
        />
        <label
          className="form-check-label scrowl__footer__label"
          htmlFor={"status_bar:" + RATIO_SIZE.Fit}
        >
          Fit
        </label>
      </div> */}
      {/* <div className="form-check form-switch form-check-reverse me-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={darkModeEnabled}
          onChange={(e) => {
            dispatch(uiActions.setDarkMode(e.target.checked));
          }}
        />
        <label className="form-check-label scrowl__footer__label" htmlFor="previewDarkMode">
          Dark Mode
        </label>
      </div> */}
    </motion.nav>
  );
}

export default GlobalStatusBar;
