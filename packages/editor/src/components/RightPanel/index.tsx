import { useEffect, useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";
import { actions as courseActions } from "./../../store/slices/course";
import { motion } from "framer-motion";

import ContentTab from "./ContentTab";

function RightPanel() {
  const dispatch = useAppDispatch();

  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);
  const templates: any = useAppSelector((state) => state["course"].templates);

  const templateName = useRef(selectedSlide ? selectedSlide.templateName : "");

  const grabHandleRef: any = useRef();

  const [panelWidth, setPanelWidth] = useState(325);
  const [isCollapsed, setCollapsed] = useState(false);
  const [firstExpansion, setFirstExpansion] = useState(true);

  useEffect(() => {
    if (templateName && selectedSlide && templateName.current !== selectedSlide.templateName) {
      templateName.current = selectedSlide.templateName;

      const newSelectionId = selectedSlide.id;

      dispatch(courseActions.clearSlideSelected());

      window.requestAnimationFrame(() => {
        dispatch(courseActions.selectSlide(newSelectionId));
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlide]);

  useEffect(() => {
    const localGrabHandleRef = grabHandleRef.current;

    const setWidthStyle = (newWidth) => {
      let minWidth = 200;
      let maxWidth = window.innerWidth / 3;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      // TEMP
      // newWidth = 325;
      document.documentElement.style.setProperty("--right-panel-width", newWidth + "px");

      return newWidth;
    };

    const mouseMoveHandler = (event) => {
      event.preventDefault();

      let newWidth = setWidthStyle(window.innerWidth - event.clientX);
      setPanelWidth(newWidth);
    };

    const mouseUpHandler = (event) => {
      document.documentElement.style.setProperty("--dragging-pointer-events", "");
      event.preventDefault();

      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    const mouseDownHandler = (event) => {
      document.documentElement.style.setProperty("--dragging-pointer-events", "none");
      event.preventDefault();

      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
    };

    const windowResizeHandler = () => {
      // Attempt to reduce side panel width
      let currentWidth = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--right-panel-width")
      );

      let newWidth = setWidthStyle(currentWidth);
      setPanelWidth(newWidth);
    };

    localGrabHandleRef.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("resize", windowResizeHandler);

    let newWidth = setWidthStyle(panelWidth);
    setPanelWidth(newWidth);

    // cleanup
    return () => {
      localGrabHandleRef.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("resize", windowResizeHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let collapsed = isCollapsed;

  let collapsedRight = panelWidth - 4 + "px";
  if (!selectedSlide) {
    collapsedRight = panelWidth + 20 + "px";
  }
  const expandedRight = "0px";

  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const friendlyTemplateName = templates.reduce((a, p) => {
    return p.key === templateName.current ? p.name : a;
  }, "Unknown Template");
  return (
    <>
      <motion.div className={"owl-pane scrowl__rightbar-shadow"} />
      <motion.div
        className={
          "owl-pane scrowl__rightbar support-high-contrast " + (collapsed ? "collapsed" : "")
        }
        initial={
          reducedAnimations
            ? { transform: "translate(" + (panelWidth + 20) + "px,0)" }
            : {
                boxShadow: "30px 0 0px 0 var(--owl-sidebar-bg)",
                transform: "translate(" + (panelWidth + 20) + "px,0)",
              }
        }
        animate={
          reducedAnimations
            ? { transform: "translate(" + (collapsed ? collapsedRight : expandedRight) + ",0)" }
            : {
                transform: "translate(" + (collapsed ? collapsedRight : expandedRight) + ",0)",
                transitionEnd: { boxShadow: "" },
              }
        }
        // initial={{ right: collapsed ? expandedRight : collapsedRight }}
        // animate={{ right: collapsed ? collapsedRight : expandedRight }}
        transition={
          reducedAnimations
            ? { duration: 0 }
            : firstExpansion
            ? { delay: animationDelay }
            : { delay: 0, duration: 0.15 }
        }
        // transition={{ right: { duration: 0.2 } }}

        onAnimationStart={() => {
          if (collapsed === true) {
            document.documentElement.style.setProperty("--right-panel-override-width", "4px");
          }
        }}
        onAnimationComplete={() => {
          if (collapsed === false) {
            document.documentElement.style.setProperty("--right-panel-override-width", "");
          }
        }}
      >
        <button
          className="btn-expand"
          onClick={() => {
            if (firstExpansion) {
              setFirstExpansion(false);
            }
            setCollapsed(!isCollapsed);
          }}
        >
          <span className="material-symbols-outlined">
            {collapsed ? "chevron_left" : "chevron_right"}
          </span>
        </button>
        <div className="scrowl__rightbar__header">
          <div className="scrowl-template">
            <span className="material-symbols-sharp color-template">dashboard</span>
            <div>
              <div className="scrowl-template__title">
                {selectedSlide ? friendlyTemplateName : "No Selection"}
              </div>
              <button
                disabled={selectedSlide ? false : true}
                className="btn btn-link btn-plain scrowl-template__link"
                onClick={() => {
                  dispatch(
                    uiActions.showOverlay({
                      type: "TemplateBrowser",
                      data: {},
                      callback: (result) => {
                        if (typeof result === "object" && result.templateName) {
                          const { templateName, templateVersion } = result;

                          window.requestAnimationFrame(() => {
                            dispatch(
                              courseActions.setSlideTemplate({ templateName, templateVersion })
                            );
                          });
                        }
                      },
                    })
                  );
                }}
              >
                Change Template
              </button>
            </div>
          </div>
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="content-tab"
                data-bs-toggle="tab"
                data-bs-target="#content"
                type="button"
                role="tab"
                aria-controls="content"
                aria-selected="true"
              >
                Content
              </button>
            </li>
            {/* <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="templateOptions-tab"
                data-bs-toggle="tab"
                data-bs-target="#templateOptions"
                type="button"
                role="tab"
                aria-controls="templateOptions"
                aria-selected="false"
                tabIndex={-1}
              >
                Template Options
              </button>
            </li> */}
          </ul>
        </div>
        <div className="tab-content scrowl__rightbar__content">
          <div
            className="tab-pane active"
            id="content"
            role="tabpanel"
            aria-labelledby="content-tab"
          >
            <ContentTab />
          </div>
          {/* <div
            className="tab-pane"
            id="templateOptions"
            role="tabpanel"
            aria-labelledby="templateOptions-tab"
          >
            <form className="scrowl-sidebar-form">
              <div className="form-check scrowl-sidebar-form__check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label" htmlFor="templateoptioncheck1">
                  Include Dynamic Lesson Info
                </label>
              </div>
              <div className="form-check scrowl-sidebar-form__check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label" htmlFor="templateoptioncheck2">
                  Include Completion Time
                </label>
              </div>
              <div>
                <label htmlFor="completion" className="form-label">
                  Completion Time
                </label>
                <input
                  className="form-control form-control-sm"
                  id="completion"
                  name="completion"
                  defaultValue="5 minutes"
                />
              </div>
            </form>
          </div> */}
          {/* <div className="tab-pane" id="comments" role="tabpanel" aria-labelledby="comments-tab">
            <div className="scrowl-comments">
              <ul className="scrowl-comments__list list-unstyled">
                <li>
                  <figure>
                    <blockquote>
                      <p>Can you make it pop more?</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                      <cite>Ann Perkins</cite> Monday at 1:43pm
                    </figcaption>
                  </figure>
                </li>
                <li>
                  <figure>
                    <blockquote>
                      <p>Swap points 2 and 3 around.</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                      <cite>Leslie Knope</cite> Yesterday at 11:34am
                    </figcaption>
                  </figure>
                </li>
              </ul>
              <div className="owl-sticky-add-item">
                <button className="owl-sticky-add-item__button">
                  Add a slide comment... <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
        <div ref={grabHandleRef} className="owl-grabhandle owl-grabhandle--right">
          <div />
        </div>
      </motion.div>
    </>
  );
}

export default RightPanel;
