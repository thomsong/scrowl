/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { motion } from "framer-motion";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as courseActions } from "../../store/slices/course";
import { actions as uiActions } from "../../store/slices/ui";

function SlideNotes(props: any) {
  const dispatch = useAppDispatch();

  const _showSlideNotes: any = useAppSelector((state) => state["ui"].showSlideNotes);
  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const slideNotes = selectedSlide && selectedSlide.slideNotes ? selectedSlide.slideNotes : "";
  const showSlideNotes = _showSlideNotes && selectedSlide;

  document.documentElement.style.setProperty(
    "--workspace-notes-height",
    showSlideNotes ? "75px" : ""
  );

  let motionHeight = showSlideNotes ? "102px" : "27px";

  return (
    <motion.div
      initial={{ opacity: reducedAnimations ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: animationDelay }}
      style={{ pointerEvents: selectedSlide ? "initial" : "none" }}
    >
      <motion.div
        className="scrowl-workspace-footer"
        style={{ overflow: "hidden" }}
        initial={{ height: "27px" }}
        animate={{ height: motionHeight }}
        transition={{ duration: reducedAnimations ? 0 : 0.2 }}
        onUpdate={(val: any) => {
          let notesHeight = parseInt(val.height) - 27;
          if (notesHeight <= 0) {
            document.documentElement.style.setProperty("--workspace-notes-height", "");

            return;
          }
          document.documentElement.style.setProperty(
            "--workspace-notes-height",
            notesHeight + "px"
          );
        }}
      >
        <a
          className={"scrowl-workspace-footer__link " + (showSlideNotes ? "" : "collapsed")}
          href="#"
          onClick={() => {
            dispatch(uiActions.setSlideNoteVisibility(!showSlideNotes));
          }}
        >
          <label className="form-label scrowl-workspace-footer__label" htmlFor="slideNotes">
            Slide Notes
          </label>
          {selectedSlide ? <span className="material-symbols-sharp">arrow_drop_down</span> : null}
        </a>
        <motion.div
          className={"collapse show"}
          initial={{ opacity: 0 }}
          animate={{ opacity: showSlideNotes ? 1 : 0 }}
          transition={{ duration: reducedAnimations ? 0 : 0.1 }}
        >
          <textarea
            style={{ minHeight: "5em" }}
            className="form-control scrowl-workspace-footer__textarea"
            value={slideNotes}
            onChange={(e) => {
              dispatch(courseActions.setSlideNotes(e.target.value));
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default SlideNotes;
