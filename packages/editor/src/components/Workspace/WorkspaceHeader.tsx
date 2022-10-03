import React, { useState, useRef } from "react";

import { motion } from "framer-motion";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as courseActions } from "../../store/slices/course";
import { actions as uiActions } from "./../../store/slices/ui";

import ContextMenu from "../../utils/ContextMenu";

export const showContextMenu = async (dispatch, slide, target?) => {
  ContextMenu.show(
    [
      {
        label: "Duplicate Slide",
        onClick: () =>
          dispatch(
            courseActions.handleSlideAction({
              action: "duplicate",
              id: slide.id,
            })
          ),
      },
      { type: "separator" },
      {
        label: "Delete Slide",
        onClick: async () => {
          const dialogResult = await dispatch(
            uiActions.showDialog({
              buttons: ["Delete Slide", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: slide.name,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            dispatch(
              courseActions.handleSlideAction({
                action: "delete",
                id: slide.id,
              })
            );
          }
        },
      },
    ],
    target
  );
};

function WorkspaceHeader(props: any) {
  const dispatch = useAppDispatch();

  const slideNameSpanRef: any = useRef();
  const [nameWidth, setNameWidth] = useState(0);
  const revertValue: any = React.useRef("");

  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const slideName = selectedSlide ? selectedSlide.name : "No slide selected...";

  window.requestAnimationFrame(() => {
    if (!slideNameSpanRef.current) {
      return;
    }

    let newWidth = slideNameSpanRef.current.offsetWidth;
    if (selectedSlide && nameWidth === newWidth) {
      return;
    }

    if (!selectedSlide) {
      newWidth = 150;
    }

    setNameWidth(newWidth);
  });

  const inputStyle: any = { width: nameWidth + 40 + "px" };
  if (!selectedSlide) {
    inputStyle.pointerEvents = "none";
    inputStyle.opacity = "0.5";
  }

  return (
    <motion.div
      className="scrowl-workspace-header h2 "
      initial={reducedAnimations ? {} : { opacity: 0 }}
      animate={reducedAnimations ? {} : { opacity: 1 }}
      transition={reducedAnimations ? {} : { delay: animationDelay + 0.1 }}
    >
      <h1 className="visually-hidden">Introduction</h1>
      <span className="material-symbols-outlined color-slide" style={{ fontSize: "1em" }}>
        rectangle
      </span>
      <div
        className="scrowl-workspace-header__slidename"
        style={{ fontSize: "20px", fontWeight: "700" }}
      >
        <span ref={slideNameSpanRef}>{slideName}</span>
        <input
          style={inputStyle}
          name="slidename"
          className="form-control"
          value={slideName}
          onChange={(e) => {
            dispatch(courseActions.setSlideName(e.target.value));
          }}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              dispatch(courseActions.setSlideName("Slide Name"));
            }
          }}
          placeholder="Slide Name"
          onFocus={(e: any) => {
            revertValue.current = e.target.value;
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              e.target.blur();
            } else if (e.key === "Escape") {
              e.target.value = revertValue.current;

              dispatch(courseActions.setSlideName(e.target.value));
              e.target.blur();
            }
          }}
        />
      </div>

      <div
        className={"owl-more-options dropdown " + (selectedSlide ? " d-inline-block " : " d-none ")}
      >
        <button
          className="btn dropdown-toggle owl-more-options__button"
          type="button"
          onClick={(e: any) => {
            e.target.blur();
            showContextMenu(dispatch, selectedSlide, e.target);
          }}
        >
          <span className="material-symbols-rounded">more_vert</span>
        </button>
      </div>
    </motion.div>
  );
}

export default WorkspaceHeader;
