/* eslint-disable jsx-a11y/anchor-is-valid */

import { useEffect, useRef } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";

import { actions as courseActions } from "./../../store/slices/course";
import { actions as leftPanelActions } from "./../../store/slices/ui/leftPanel";
import { motion, AnimatePresence } from "framer-motion";

import {
  showModuleContextMenu,
  showLessonContextMenu,
  showSlideContextMenu,
} from "./outline_menus";

const DEBUG_EXPAND_ALL: boolean = false;

function Outline(props: any) {
  const dispatch = useAppDispatch();

  const panelContainer: any = useRef();
  const firstSelectionFocus = useRef(true);
  const lastSlideFocusTS = useRef(-1);
  const previouslyExpandedModules: any = useRef({});

  const lastEditSlideNameId = useRef(-1);
  const lastEditLessonNameId = useRef(-1);
  const lastEditModuleNameId = useRef(-1);

  const expandedOutlineModules = useAppSelector(
    (state) => state["ui/leftPanel"].expandedOutlineModules
  );
  const expandedOutlineLessons = useAppSelector(
    (state) => state["ui/leftPanel"].expandedOutlineLessons
  );

  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);

  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const modules: any = useAppSelector((state) => state["course"].modules);
  const _lessons: any = useAppSelector((state) => state["course"].lessons);
  const _slides: any = useAppSelector((state) => state["course"].slides);

  const lessons = [..._lessons];
  lessons.sort((a, b) => a.moduleId - b.moduleId);

  const slides = [..._slides];
  slides.sort((a, b) => a.lessonId - b.lessonId);

  const slideFocusTS: any = useAppSelector((state) => state["ui/leftPanel"].slideFocusTS);

  const editSlideNameId: any = useAppSelector((state) => state["ui/leftPanel"].editSlideNameId);
  const editLessonNameId: any = useAppSelector((state) => state["ui/leftPanel"].editLessonNameId);
  const editModuleNameId: any = useAppSelector((state) => state["ui/leftPanel"].editModuleNameId);

  useEffect(() => {
    firstSelectionFocus.current = false;
  }, []);

  // Check to see if just went into edit mode
  // Slide name edit
  if (lastEditSlideNameId.current && editSlideNameId !== lastEditSlideNameId.current) {
    lastEditSlideNameId.current = editSlideNameId;
    if (panelContainer.current && editSlideNameId !== -1) {
      window.requestAnimationFrame(() => {
        const elEditInput = panelContainer.current.querySelector(".scrowl-outline__detail-input");
        if (elEditInput) {
          elEditInput.focus();
          elEditInput.select();
        }
      });
    }
  }

  // Lesson name edit
  if (lastEditLessonNameId.current && editLessonNameId !== lastEditLessonNameId.current) {
    lastEditLessonNameId.current = editLessonNameId;
    if (panelContainer.current && editLessonNameId !== -1) {
      window.requestAnimationFrame(() => {
        const elEditInput = panelContainer.current.querySelector(".scrowl-outline__detail-input");
        if (elEditInput) {
          elEditInput.focus();
          elEditInput.select();
        }
      });
    }
  }

  // Module name edit
  if (lastEditModuleNameId.current && editModuleNameId !== lastEditModuleNameId.current) {
    lastEditModuleNameId.current = editModuleNameId;
    if (panelContainer.current && editModuleNameId !== -1) {
      window.requestAnimationFrame(() => {
        const elEditInput = panelContainer.current.querySelector(".scrowl-outline__detail-input");
        if (elEditInput) {
          elEditInput.focus();
          elEditInput.select();
        }
      });
    }
  }

  if (selectedSlide && panelContainer.current && slideFocusTS > lastSlideFocusTS.current) {
    lastSlideFocusTS.current = slideFocusTS;
    // Focus on selected slide

    window.requestAnimationFrame(() => {
      const scrollPadding = 20;
      const selectedSlideClass = ".slide-id-" + selectedSlide.id;

      if (!panelContainer.current || !panelContainer.current.parentNode) {
        return;
      }

      const elContainer = panelContainer.current.parentNode;
      const elSlide = elContainer.querySelector(selectedSlideClass);

      if (elSlide && elSlide.getBoundingClientRect) {
        const elSlideBounds = elSlide.getBoundingClientRect();
        const elContainerBounds = elContainer.getBoundingClientRect();

        if (elSlideBounds.top - scrollPadding < elContainerBounds.top) {
          elContainer.scrollTop -= elContainerBounds.top - elSlideBounds.top + scrollPadding;
        } else if (elSlideBounds.bottom + scrollPadding > elContainerBounds.bottom) {
          elContainer.scrollTop += elSlideBounds.bottom + scrollPadding - elContainerBounds.bottom;
        }
      }
    });
  }

  let dragElement: any = null;
  let dragElementType: string = "";
  let dropTargetDataset: any = {};

  let editNameInput = (item: any, type: string) => {
    const setNameValue = (name) => {
      if (type === "slide") {
        dispatch(
          courseActions.setSlideName({
            id: item.id,
            name: name,
          })
        );
      } else if (type === "lesson") {
        dispatch(
          courseActions.setLessonName({
            id: item.id,
            name: name,
          })
        );
      } else if (type === "module") {
        dispatch(
          courseActions.setModuleName({
            id: item.id,
            name: name,
          })
        );
      }
    };

    return (
      <textarea
        autoFocus
        style={{ marginTop: "-3px", marginLeft: "-3px", height: "5px" }}
        className="scrowl-outline__detail-input"
        value={item.name}
        onChange={(e) => {
          let newValue = e.target.value;
          newValue = newValue.replace(/(\r\n|\n|\r)/gm, "");

          setNameValue(newValue);

          e.currentTarget.value = newValue;
          e.currentTarget.style.height = "5px";
          e.currentTarget.style.height = 2 + e.currentTarget.scrollHeight + "px";
        }}
        onBlur={(e) => {
          let newValue = e.target.value;
          newValue = newValue.replace(/(\r\n|\n|\r)/gm, "");

          if (newValue.trim() === "") {
            if (type === "slide") {
              newValue = "Slide Name";
            } else if (type === "lesson") {
              newValue = "Lesson Name";
            } else if (type === "module") {
              newValue = "Module Name";
            }
          }

          setNameValue(newValue.trim());

          dispatch(leftPanelActions.clearEditMode());
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "Escape") {
            // Revert
            const target: any = e.target;
            target.value = e.currentTarget.dataset.initial_value;
            e.currentTarget.blur();
          }
        }}
        onInput={(e) => {
          e.currentTarget.style.height = "5px";
          e.currentTarget.style.height = 2 + e.currentTarget.scrollHeight + "px";
        }}
        onFocus={(e) => {
          e.currentTarget.dataset.initial_value = e.target.value;
          e.currentTarget.style.height = "5px";
          e.currentTarget.style.height = 2 + e.currentTarget.scrollHeight + "px";
        }}
      />
    );
  };

  const retVal = (
    <div
      ref={panelContainer}
      className={"tab-pane " + (props.active ? "active" : "")}
      role="tabpanel"
      onDragLeave={(e) => {
        if (!dragElement) {
          return;
        }

        document.querySelectorAll("li.drop-indicator").forEach((el) => {
          el.classList.remove("drop-indicator");
        });
      }}
    >
      <ul
        className="nav flex-column scrowl-outline"
        onDragOver={(e) => {
          if (!dragElement || dragElementType !== "module") {
            document.querySelectorAll("li.drop-indicator").forEach((el) => {
              el.classList.remove("drop-indicator");
            });

            return;
          }

          let el: any = e.target;

          while (el && el.tagName !== "UL" && !el.classList.contains("scrowl-outline")) {
            el = el.parentNode;
          }

          document.querySelectorAll("li.drop-indicator").forEach((el) => {
            el.classList.remove("drop-indicator");
          });

          if (!el) {
            return;
          }

          const elRect = el.getBoundingClientRect();

          let elContainerModules = el.querySelectorAll(
            ".scrowl-outline__item--module, .scrowl-outline__item--add-module"
          );

          if (e.clientY >= elRect.top && elContainerModules) {
            let elementFound = false;

            elContainerModules.forEach((module) => {
              const moduleRect = module.getBoundingClientRect();

              if (!elementFound) {
                let middlePoint = (moduleRect.top + moduleRect.bottom) / 2;

                if (e.pageY <= middlePoint) {
                  dropTargetDataset = module.dataset;
                  module.classList.add("drop-indicator");
                  module.classList.add("module");

                  elementFound = true;
                }
              }
            });
          }

          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {Object.keys(modules).map((moduleId) => {
          const module = modules[moduleId];

          const moduleExpanded =
            DEBUG_EXPAND_ALL || expandedOutlineModules.indexOf(module.id) >= 0 ? true : false;

          let editMode = module.id === editModuleNameId;

          let moduleNewlyExpanded = false;
          if (moduleExpanded && !previouslyExpandedModules.current[module.id]) {
            moduleNewlyExpanded = true;
          }

          return (
            <li
              data-module={module.id}
              key={module.id}
              className="scrowl-outline__item scrowl-outline__item--module"
              onDragOver={(e) => {
                if (!dragElement || dragElementType !== "lesson") {
                  document.querySelectorAll("li.drop-indicator").forEach((el) => {
                    el.classList.remove("drop-indicator");
                  });

                  return;
                }

                let el: any = e.target;
                while (el && el.tagName !== "LI") {
                  el = el.parentNode;
                }

                while (
                  el &&
                  el.classList &&
                  !el.classList.contains("scrowl-outline__item--module")
                ) {
                  el = el.parentNode;
                }

                document.querySelectorAll("li.drop-indicator").forEach((el) => {
                  el.classList.remove("drop-indicator");
                });

                if (!el || !el.getBoundingClientRect) {
                  return;
                }

                const elRect = el.getBoundingClientRect();
                let elContainerLessons = el.querySelectorAll(
                  ".scrowl-outline__item--lesson, .scrowl-outline__item--add-lesson"
                );

                if (e.clientY >= elRect.top && elContainerLessons) {
                  let elementFound = false;

                  elContainerLessons.forEach((lesson) => {
                    const lessonRect = lesson.getBoundingClientRect();

                    if (!elementFound) {
                      let middlePoint = (lessonRect.top + lessonRect.bottom) / 2;

                      if (e.pageY <= middlePoint) {
                        dropTargetDataset = lesson.dataset;

                        lesson.classList.add("drop-indicator");
                        lesson.classList.add("lesson");
                        elementFound = true;
                      }
                    }
                  });
                }

                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <div
                className="scrowl-outline__item__wrapper aaa"
                onContextMenu={() => {
                  showModuleContextMenu(dispatch, module);
                }}
              >
                {editMode ? (
                  <span
                    role="button"
                    className="scrowl-outline__item__link"
                    style={{ paddingBottom: "calc(0.66em - 3px)" }}
                  >
                    <span className="material-symbols-sharp scrowl-outline__dropdown-icon">
                      arrow_drop_down
                    </span>
                    <span className="material-symbols-rounded scrowl-outline__detail-icon">
                      folder
                    </span>
                    {editNameInput(module, "module")}
                  </span>
                ) : (
                  <a
                    role="button"
                    href="#"
                    className="scrowl-outline__item__link can-drag"
                    draggable="true"
                    aria-expanded={moduleExpanded ? "true" : "false"}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        leftPanelActions.toggleOutlineItemExpanded({
                          id: module.id,
                          type: "module",
                        })
                      );
                    }}
                    onDragStart={(e) => {
                      dragElementType = "module";

                      const el: any = e.currentTarget.parentElement;

                      dragElement = el.parentElement;
                      dragElement.classList.add("dragging");
                    }}
                    onDragEnd={(e) => {
                      if (!document.querySelectorAll("li.drop-indicator").length) {
                        return;
                      }

                      document.querySelectorAll("li.drop-indicator").forEach((el) => {
                        el.classList.remove("drop-indicator");
                      });

                      if (!dragElement) {
                        return;
                      }

                      dragElement.classList.remove("dragging");

                      dispatch(
                        courseActions.moveModule({
                          from: {
                            id: parseInt(dragElement.dataset.module),
                          },
                          to: {
                            id: parseInt(dropTargetDataset.module),
                          },
                        })
                      );

                      dragElement = null;
                    }}
                  >
                    <span className="material-symbols-sharp scrowl-outline__dropdown-icon">
                      arrow_drop_down
                    </span>
                    <span className="material-symbols-rounded scrowl-outline__detail-icon">
                      folder
                    </span>

                    <span className="scrowl-outline__detail-text">{module.name}</span>
                  </a>
                )}

                <div className="owl-more-options dropdown">
                  <button
                    className="btn dropdown-toggle owl-more-options__button"
                    type="button"
                    onClick={(e: any) => {
                      e.target.blur();
                      showModuleContextMenu(dispatch, module, e.target);
                    }}
                  >
                    <span className="material-symbols-rounded">more_vert</span>
                  </button>
                </div>
              </div>

              {moduleExpanded ? (
                <AnimatePresence>
                  <motion.ul
                    className={"nav flex-column " + (moduleExpanded ? "show" : "collapse")}
                    initial={
                      firstSelectionFocus.current
                        ? { overflowY: "hidden" }
                        : { height: 0, overflowY: "hidden" }
                    }
                    animate={
                      firstSelectionFocus.current
                        ? {
                            overflowY: "hidden",
                            transitionEnd: {
                              overflowY: "initial",
                            },
                          }
                        : {
                            overflowY: "hidden",
                            height: "fit-content",
                            transitionEnd: {
                              overflowY: "initial",
                            },
                          }
                    }
                    transition={{ duration: reducedAnimations ? 0 : 0.15 }}
                    exit={{
                      height: 0,
                      overflowY: "hidden",
                      transition: { duration: reducedAnimations ? 0 : 0.15 },
                    }}
                    // style={{ overflowY: "hidden" }}
                    onAnimationComplete={(e: any) => {
                      let newExpandedState = { ...previouslyExpandedModules.current };

                      if (e.height === "fit-content") {
                        // Expanded
                        newExpandedState[module.id] = true;
                      } else {
                        // Contracted
                        delete newExpandedState[module.id];
                      }

                      previouslyExpandedModules.current = newExpandedState;
                    }}
                  >
                    {Object.keys(lessons).map((lessonId) => {
                      const lesson = lessons[lessonId];
                      if (lesson.moduleId !== module.id) {
                        // only include module lessons
                        return null;
                      }

                      const lessonExpanded =
                        DEBUG_EXPAND_ALL || expandedOutlineLessons.indexOf(lesson.id) >= 0
                          ? true
                          : false;

                      let editMode = lesson.id === editLessonNameId;
                      return (
                        <li
                          data-module={module.id}
                          data-lesson={lesson.id}
                          key={lesson.id}
                          className="scrowl-outline__item scrowl-outline__item--lesson"
                          onDragOver={(e) => {
                            if (!dragElement || dragElementType !== "slide") {
                              document.querySelectorAll("li.drop-indicator").forEach((el) => {
                                el.classList.remove("drop-indicator");
                              });

                              return;
                            }

                            let el: any = e.target;
                            while (el && el.tagName !== "LI") {
                              el = el.parentNode;
                            }

                            while (el && !el.classList.contains("scrowl-outline__item--lesson")) {
                              el = el.parentNode;
                            }

                            document.querySelectorAll("li.drop-indicator").forEach((el) => {
                              el.classList.remove("drop-indicator");
                            });

                            if (!el) {
                              return;
                            }

                            const elRect = el.getBoundingClientRect();
                            const elContainerSlides = el.querySelectorAll(".scrowl-outline__item");

                            if (e.clientY >= elRect.top && elContainerSlides) {
                              let elementFound = false;

                              elContainerSlides.forEach((slide) => {
                                const slideRect = slide.getBoundingClientRect();

                                if (!elementFound) {
                                  let middlePoint = (slideRect.top + slideRect.bottom) / 2;

                                  if (e.pageY <= middlePoint) {
                                    dropTargetDataset = slide.dataset;
                                    slide.classList.add("drop-indicator");
                                    slide.classList.add("slide");

                                    elementFound = true;
                                  }
                                }
                              });
                            }

                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <div
                            className="scrowl-outline__item__wrapper"
                            onContextMenu={() => {
                              showLessonContextMenu(dispatch, lesson);
                            }}
                          >
                            {editMode ? (
                              <span
                                role="button"
                                className="scrowl-outline__item__link"
                                style={{ paddingBottom: "calc(0.66em - 3px)" }}
                              >
                                <span className="material-symbols-sharp scrowl-outline__dropdown-icon">
                                  arrow_drop_down
                                </span>
                                <span className="material-symbols-sharp scrowl-outline__detail-icon">
                                  interests
                                </span>
                                {editNameInput(lesson, "lesson")}
                              </span>
                            ) : (
                              <a
                                href="#"
                                role="button"
                                className="scrowl-outline__item__link can-drag"
                                draggable="true"
                                aria-expanded={lessonExpanded ? "true" : "false"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(
                                    leftPanelActions.toggleOutlineItemExpanded({
                                      id: lesson.id,
                                      type: "lesson",
                                    })
                                  );
                                }}
                                onDragStart={(e) => {
                                  dragElementType = "lesson";

                                  const el: any = e.currentTarget.parentElement;

                                  dragElement = el.parentElement;
                                  dragElement.classList.add("dragging");
                                }}
                                onDragEnd={(e) => {
                                  if (!document.querySelectorAll("li.drop-indicator").length) {
                                    return;
                                  }

                                  document.querySelectorAll("li.drop-indicator").forEach((el) => {
                                    el.classList.remove("drop-indicator");
                                  });

                                  if (!dragElement) {
                                    return;
                                  }

                                  dragElement.classList.remove("dragging");

                                  dispatch(
                                    courseActions.moveLesson({
                                      from: {
                                        id: parseInt(dragElement.dataset.lesson),
                                        module: parseInt(dragElement.dataset.module),
                                      },
                                      to: {
                                        id: parseInt(dropTargetDataset.lesson),
                                        module: parseInt(dropTargetDataset.module),
                                      },
                                    })
                                  );

                                  dragElement = null;
                                }}
                              >
                                <span className="material-symbols-sharp scrowl-outline__dropdown-icon">
                                  arrow_drop_down
                                </span>
                                <span className="material-symbols-sharp scrowl-outline__detail-icon">
                                  interests
                                </span>

                                <span className="scrowl-outline__detail-text">{lesson.name}</span>
                              </a>
                            )}
                            <div className="owl-more-options dropdown">
                              <button
                                className="btn dropdown-toggle owl-more-options__button"
                                type="button"
                                onClick={(e: any) => {
                                  e.target.blur();
                                  showLessonContextMenu(dispatch, lesson, e.target);
                                }}
                              >
                                <span className="material-symbols-rounded">more_vert</span>
                              </button>
                            </div>
                          </div>
                          {lessonExpanded ? (
                            <AnimatePresence>
                              <motion.ul
                                className={
                                  "nav flex-column " + (lessonExpanded ? "show" : "collapse")
                                }
                                initial={
                                  !firstSelectionFocus.current && !moduleNewlyExpanded
                                    ? { height: 0, overflowY: "hidden" }
                                    : { overflowY: "hidden" }
                                }
                                animate={
                                  !firstSelectionFocus.current && !moduleNewlyExpanded
                                    ? {
                                        height: "fit-content",
                                        overflowY: "hidden",
                                        transitionEnd: {
                                          overflowY: "initial",
                                        },
                                      }
                                    : {
                                        overflowY: "hidden",
                                        transitionEnd: {
                                          overflowY: "initial",
                                        },
                                      }
                                }
                                transition={{ duration: reducedAnimations ? 0 : 0.15 }}
                                exit={{
                                  height: 0,
                                  overflowY: "hidden",
                                  transition: { duration: reducedAnimations ? 0 : 0.15 },
                                }}
                                // style={{ overflowY: "hidden" }}
                              >
                                {Object.keys(slides).map((slideIndex) => {
                                  const slide = slides[slideIndex];

                                  if (slide.lessonId !== lesson.id) {
                                    // only include lesson slides
                                    return null;
                                  }

                                  const slideIsSelected = selectedSlide
                                    ? slide.id === selectedSlide.id
                                    : false;

                                  let editMode = slide.id === editSlideNameId;
                                  return (
                                    <li
                                      data-module={module.id}
                                      data-lesson={lesson.id}
                                      data-slide={slide.id}
                                      key={slide.id}
                                      className={
                                        "slide-id-" +
                                        slide.id +
                                        " scrowl-outline__item scrowl-outline__item--slide " +
                                        (slide.id === editSlideNameId ? "edit-mode" : "")
                                      }
                                    >
                                      {/* {!slideIsSelected ? <hr className="insert-marker top" /> : null} */}
                                      <div
                                        className="scrowl-outline__item__wrapper"
                                        onContextMenu={() => {
                                          showSlideContextMenu(dispatch, slide);
                                        }}
                                      >
                                        {editMode ? (
                                          <span
                                            role="button"
                                            style={{ paddingBottom: "calc(0.66em - 3px)" }}
                                            className={
                                              slideIsSelected
                                                ? "scrowl-outline__item__link active"
                                                : "scrowl-outline__item__link"
                                            }
                                          >
                                            <span className="material-symbols-outlined scrowl-outline__detail-icon">
                                              rectangle
                                            </span>
                                            {editNameInput(slide, "slide")}
                                          </span>
                                        ) : (
                                          <a
                                            onClick={async (e) => {
                                              e.preventDefault();

                                              if (selectedSlide && selectedSlide.id === slide.id) {
                                                return;
                                              }
                                              await dispatch(courseActions.selectSlide(slide.id));
                                            }}
                                            href="#"
                                            role="button"
                                            className={
                                              slideIsSelected
                                                ? "scrowl-outline__item__link active can-drag"
                                                : "scrowl-outline__item__link can-drag"
                                            }
                                            draggable="true"
                                            onDragStart={(e) => {
                                              dragElementType = "slide";

                                              const el: any = e.currentTarget.parentElement;

                                              dragElement = el.parentElement;
                                              dragElement.classList.add("dragging");
                                            }}
                                            onDragEnd={(e) => {
                                              if (
                                                !document.querySelectorAll("li.drop-indicator")
                                                  .length
                                              ) {
                                                return;
                                              }
                                              document
                                                .querySelectorAll("li.drop-indicator")
                                                .forEach((el) => {
                                                  el.classList.remove("drop-indicator");
                                                });

                                              if (!dragElement) {
                                                return;
                                              }

                                              dragElement.classList.remove("dragging");

                                              dispatch(
                                                courseActions.moveSlide({
                                                  from: {
                                                    id: parseInt(dragElement.dataset.slide),
                                                    module: parseInt(dragElement.dataset.module),
                                                    lesson: parseInt(dragElement.dataset.lesson),
                                                  },
                                                  to: {
                                                    id: parseInt(dropTargetDataset.slide),
                                                    module: parseInt(dropTargetDataset.module),
                                                    lesson: parseInt(dropTargetDataset.lesson),
                                                  },
                                                })
                                              );

                                              dragElement = null;
                                            }}
                                          >
                                            <span className="material-symbols-outlined scrowl-outline__detail-icon">
                                              rectangle
                                            </span>

                                            <span className="scrowl-outline__detail-text">
                                              {slide.name}
                                            </span>
                                          </a>
                                        )}
                                        <div className="owl-more-options dropdown">
                                          <button
                                            className="btn dropdown-toggle owl-more-options__button"
                                            type="button"
                                            onClick={(e: any) => {
                                              e.target.blur();
                                              showSlideContextMenu(dispatch, slide, e.target);
                                            }}
                                          >
                                            <span className="material-symbols-rounded">
                                              more_vert
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  );
                                })}

                                <li
                                  data-module={module.id}
                                  data-lesson={lesson.id}
                                  data-slide={-1}
                                  className="scrowl-outline__item scrowl-outline__item--add-slide"
                                >
                                  <div className="scrowl-outline__item__wrapper">
                                    <a
                                      href="#"
                                      className="scrowl-outline__item__link"
                                      onClick={() =>
                                        dispatch(
                                          courseActions.handleLessonAction({
                                            action: "add_new_slide",
                                            id: lesson.id,
                                          })
                                        )
                                      }
                                    >
                                      <span className="material-symbols-sharp scrowl-outline__detail-icon">
                                        add
                                      </span>
                                      <span className="scrowl-outline__detail-text">
                                        Add New Slide
                                      </span>
                                    </a>
                                  </div>
                                </li>
                              </motion.ul>
                            </AnimatePresence>
                          ) : (
                            <AnimatePresence></AnimatePresence>
                          )}
                        </li>
                      );
                    })}

                    <li
                      data-module={module.id}
                      data-lesson={-1}
                      className="scrowl-outline__item scrowl-outline__item--add-lesson"
                    >
                      <div className="scrowl-outline__item__wrapper">
                        <a
                          href="#"
                          className="scrowl-outline__item__link"
                          onClick={() =>
                            dispatch(
                              courseActions.handleModuleAction({
                                action: "add_new_lesson",
                                id: module.id,
                              })
                            )
                          }
                        >
                          <span className="material-symbols-sharp scrowl-outline__detail-icon">
                            add
                          </span>
                          <span className="scrowl-outline__detail-text">Add New Lesson</span>
                        </a>
                      </div>
                    </li>
                  </motion.ul>
                </AnimatePresence>
              ) : (
                <AnimatePresence></AnimatePresence>
              )}
            </li>
          );
        })}

        <li data-module={-1} className="scrowl-outline__item scrowl-outline__item--add-module">
          <div className="scrowl-outline__item__wrapper">
            <a
              href="#"
              className="scrowl-outline__item__link"
              onClick={() =>
                dispatch(
                  courseActions.handleModuleAction({
                    action: "add_new_module",
                    id: -1,
                  })
                )
              }
            >
              <span className="material-symbols-sharp scrowl-outline__detail-icon">add</span>
              <span className="scrowl-outline__detail-text">Add New Module</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  );

  return retVal;
}

export default Outline;
