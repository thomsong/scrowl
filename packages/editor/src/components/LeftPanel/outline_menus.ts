import { actions as uiActions } from "./../../store/slices/ui";
import { actions as courseActions } from "./../../store/slices/course";
import { actions as leftPanelActions } from "./../../store/slices/ui/leftPanel";

import ContextMenu from "../../utils/ContextMenu";

export const showModuleContextMenu = async (dispatch, module, target?) => {
  const handleAction = (action) => {
    dispatch(
      courseActions.handleModuleAction({
        action,
        id: module.id,
      })
    );
  };
  ContextMenu.show(
    [
      {
        label: "Add Lesson",
        onClick: () => handleAction("add_new_lesson"),
      },
      {
        label: "Duplicate Module",
        onClick: () => handleAction("duplicate"),
      },
      {
        label: "Add New Module After",
        onClick: () => handleAction("add_new_module_after"),
      },
      { type: "separator" },
      {
        label: "Rename",
        onClick: () =>
          dispatch(
            leftPanelActions.handleModuleAction({
              action: "rename",
              id: module.id,
            })
          ),
      },
      { type: "separator" },
      {
        label: "Delete Module",
        onClick: async () => {
          const dialogResult = await dispatch(
            uiActions.showDialog({
              buttons: ["Delete Module", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: module.name,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            handleAction("delete");
          }
        },
      },
    ],
    target
  );
};

export const showLessonContextMenu = async (dispatch, lesson, target?) => {
  const handleAction = (action) => {
    dispatch(
      courseActions.handleLessonAction({
        action,
        id: lesson.id,
      })
    );
  };
  ContextMenu.show(
    [
      {
        label: "Add Slide",
        onClick: () => handleAction("add_new_slide"),
      },
      {
        label: "Duplicate Lesson",
        onClick: () => handleAction("duplicate"),
      },
      {
        label: "Add New Lesson After",
        onClick: () => handleAction("add_new_lesson_after"),
      },

      { type: "separator" },
      {
        label: "Rename",
        onClick: () =>
          dispatch(
            leftPanelActions.handleLessonAction({
              action: "rename",
              id: lesson.id,
            })
          ),
      },
      { type: "separator" },
      {
        label: "Delete Lesson",
        onClick: async () => {
          const dialogResult = await dispatch(
            uiActions.showDialog({
              buttons: ["Delete Lesson", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: lesson.name,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            handleAction("delete");
          }
        },
      },
    ],
    target
  );
};

export const showSlideContextMenu = async (dispatch, slide, target?) => {
  const handleAction = (action) => {
    dispatch(
      courseActions.handleSlideAction({
        action,
        id: slide.id,
      })
    );
  };

  ContextMenu.show(
    [
      {
        label: "Duplicate Slide",
        onClick: () => handleAction("duplicate"),
      },
      {
        label: "Add New Slide After",
        onClick: () => handleAction("add_slide_after"),
      },

      { type: "separator" },
      {
        label: "Rename",
        onClick: () =>
          dispatch(
            leftPanelActions.handleSlideAction({
              action: "rename",
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
            handleAction("delete");
          }
        },
      },
    ],
    target
  );
};
