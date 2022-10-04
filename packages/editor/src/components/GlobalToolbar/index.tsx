/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as courseActions } from "./../../store/slices/course";
import { actions as uiActions, PREVIEW_MODE } from "./../../store/slices/ui";
import { motion } from "framer-motion";

import ToolbarLogo from "./ToolbarLogo";

import ContextMenu, { TARGET_ALIGNMENT } from "../../utils/ContextMenu";
import { _p } from "../../utils";

export const showPreviewContextMenu = async (previewMode, dispatch, target?, xOffset?) => {
  ContextMenu.show(
    [
      {
        label: "Current Slide",
        onClick: () => {
          dispatch(uiActions.launchPreview(PREVIEW_MODE.slide));
        },
        checked: previewMode === PREVIEW_MODE.slide,
      },
      {
        label: "Current Lesson",
        onClick: () => {
          dispatch(uiActions.launchPreview(PREVIEW_MODE.lesson));
        },
        checked: previewMode === PREVIEW_MODE.lesson,
      },
      {
        label: "Current Module",
        onClick: () => {
          dispatch(uiActions.launchPreview(PREVIEW_MODE.module));
        },
        checked: previewMode === PREVIEW_MODE.module,
      },
      { type: "separator" },
      {
        label: "Entire Course",
        onClick: () => {
          dispatch(uiActions.launchPreview(PREVIEW_MODE.course));
        },
        checked: previewMode === PREVIEW_MODE.course,
      },
    ],
    target,
    TARGET_ALIGNMENT.LeftBottom,
    [-100 + (xOffset ? xOffset : 0), 6]
  );
};

function GlobalToolbar() {
  const dispatch = useAppDispatch();

  const courseNameSpanRef: any = useRef();

  const courseSettings: any = useAppSelector((state) => state["course"].course);
  const selectedSlide: any = useAppSelector((state) => state["course"].selectedSlide);

  const previewMode: any = useAppSelector((state) => state["ui"].previewMode);
  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const [courseNameContent, setCourseNameContent] = useState(courseSettings.name);
  const [courseNameWidth, setCourseNameWidth] = useState(0);

  const revertValue: any = React.useRef("");

  useEffect(() => {
    const newWidth = courseNameSpanRef.current.offsetWidth + 12;

    setCourseNameWidth(newWidth);
  }, [courseNameContent]);

  useEffect(() => {
    if (!selectedSlide) {
      return;
    }

    window.setTimeout(async () => {
      if (await (window as any).ScrowlApp.settings.get("first_load", true)) {
        (window as any).ScrowlApp.settings.set("first_load", false);

        dispatch(uiActions.launchPreview(PREVIEW_MODE.default));
      }
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlide]);

  return (
    <motion.nav
      className="navbar navbar-expand fixed-top scrowl__navbar support-high-contrast"
      initial={reducedAnimations ? {} : { opacity: 0 }}
      animate={reducedAnimations ? {} : { opacity: 1 }}
      transition={
        reducedAnimations
          ? {}
          : {
              opacity: { delay: animationDelay, duration: 0.2 },
            }
      }
    >
      <ToolbarLogo reducedAnimations={reducedAnimations} animationDelay={animationDelay} />

      <motion.div
        className="scrowl-course-name"
        initial={reducedAnimations ? {} : { marginTop: "-80px" }}
        animate={reducedAnimations ? {} : { marginTop: "0px" }}
        transition={
          reducedAnimations
            ? {}
            : {
                marginTop: { delay: animationDelay, type: "spring", bounce: 0.52 },
              }
        }
      >
        <span ref={courseNameSpanRef}>{courseSettings.name.replace(/ /g, "\u00A0")}</span>
        <input
          style={{ width: courseNameWidth + 20 + "px" }}
          className="form-control"
          value={courseSettings.name}
          onChange={(e) => {
            setCourseNameContent(e.target.value);
            dispatch(courseActions.setCourseName(e.target.value));
          }}
          onDragOver={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onFocus={(e: any) => {
            revertValue.current = e.target.value;
          }}
          onBlur={(e: any) => {
            let finalVal = e.target.value;
            finalVal = finalVal.replace(/\s\s+/g, " ");

            setCourseNameContent(finalVal);
            dispatch(courseActions.setCourseName(finalVal));
          }}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              e.target.blur();
            } else if (e.key === "Escape") {
              e.target.value = revertValue.current;
              e.target.blur();
            }
          }}
          placeholder="Untitled Course"
        />
      </motion.div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav align-items-center me-auto">
          {/* <li
            className="nav-item dropdown scrowl-versions"
            data-bs-toggle="tooltip"
            data-bs-delay='{"show":400,"hide":0}'
            data-bs-title="Project Version History"
            data-bs-placement="bottom"
          >
            <a
              className="nav-link dropdown-toggle badge"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              v7<span className="material-symbols-sharp">arrow_drop_down</span>
            </a>
            <ul className="dropdown-menu scrowl-versions__menu">
              <li className="dropdown-header">Version History</li>
              <li>
                <table className="table table-hover">
                  <thead className="visually-hidden">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Date</th>
                      <th scope="col">User</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <td>
                        <span className="material-symbols-rounded">sync</span>
                      </td>
                      <td>Unsaved changes</td>
                      <td>Ann Perkins</td>
                    </tr>
                    <tr>
                      <td>v7</td>
                      <td>Today, 9:42 AM</td>
                      <td>Tom Haverford</td>
                    </tr>
                    <tr>
                      <td>v6</td>
                      <td>Yesterday, 9:30 PM</td>
                      <td>Tom Haverford</td>
                    </tr>
                    <tr>
                      <td>v5</td>
                      <td>Yesterday, 11:30 AM</td>
                      <td>Tom Haverford</td>
                    </tr>
                    <tr>
                      <td>v4</td>
                      <td>Yesterday, 10:24 AM</td>
                      <td>Tom Haverford</td>
                    </tr>
                    <tr>
                      <td>v3</td>
                      <td>July 18, 1:58 PM</td>
                      <td>Leslie Knope</td>
                    </tr>
                  </tbody>
                </table>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  See More History...
                </a>
              </li>
            </ul>
          </li> */}
          {/* <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              data-bs-toggle="tooltip"
              data-bs-delay='{"show":400,"hide":0}'
              data-bs-title="Cloud Saved"
              data-bs-placement="bottom"
            >
              <span className="material-symbols-rounded">cloud_done</span>
              <span className="visually-hidden">Cloud Save</span>
            </a>
          </li> */}
          {/* <li
            className="nav-item dropdown me-auto"
            data-bs-toggle="tooltip"
            data-bs-delay='{"show":400,"hide":0}'
            data-bs-title="Collaborators"
            data-bs-placement="bottom"
          >
            <a
              href="#"
              className="owl-avatar dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://i.pravatar.cc/32?img=scrowl"
                alt="user avatar"
                className="owl-avatar__img owl-avatar__img--purple"
              />
              <img
                src="https://i.pravatar.cc/32?img=owl"
                alt="user avatar"
                className="owl-avatar__img owl-avatar__img--yellow"
              />
              <div className="owl-avatar__img">
                <span className="material-symbols-sharp">group_add</span>
              </div>
            </a>
            <ul className="dropdown-menu" style={{ minWidth: "15rem" }}>
              <li>
                <div className="dropdown-header form-label">Collaborators</div>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex">
                  <img
                    src="https://i.pravatar.cc/32?img=scrowl"
                    alt="user avatar"
                    className="owl-avatar__img owl-avatar__img--purple me-2"
                  />
                  <div>
                    Tom Haverford
                    <div className="small">Last viewed 15h ago</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="dropdown-item d-flex">
                  <img
                    src="https://i.pravatar.cc/32?img=owl"
                    alt="user avatar"
                    className="owl-avatar__img owl-avatar__img--yellow me-2"
                  />
                  <div>
                    Leslie Knope
                    <div className="small">Last viewed 3d ago</div>
                  </div>
                </a>
              </li>
              <li className="dropdown-divider" />
              <li>
                <a href="#" className="dropdown-item">
                  <span className="material-symbols-sharp me-2">group_add</span>Invite User...
                </a>
              </li>
            </ul>
          </li> */}
        </ul>
        <motion.ul className="navbar-nav align-items-center">
          <li className="scrowl-navbar__actions">
            <div className="btn-group btn-ghost-group ms-2">
              <button
                type="button"
                className="btn btn-sm btn-ghost-primary"
                onClick={() => {
                  dispatch(uiActions.launchPreview(PREVIEW_MODE.default));
                }}
                onContextMenu={(e: any) => {
                  e.target.blur();
                  showPreviewContextMenu(previewMode, dispatch, e.target, 102);

                  e.preventDefault();
                }}
              >
                <span className="material-symbols-sharp color-default owl-btn-icon">interests</span>
                Preview
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost-primary dropdown-toggle dropdown-toggle-split"
                {..._p("onClick", "onContextMenu", (e: any) => {
                  e.target.blur();
                  e.preventDefault();
                  showPreviewContextMenu(previewMode, dispatch, e.target);
                })}
              >
                <span className="material-symbols-sharp">arrow_drop_down</span>
              </button>
            </div>
            <button
              className="btn btn-primary btn-sm ms-3"
              type="button"
              {..._p("onClick", "onContextMenu", () => {
                dispatch(
                  uiActions.showOverlay({
                    type: "Publish",
                    data: {},
                  })
                );
              })}
            >
              <span className="material-symbols-sharp">rocket_launch</span> Publish
            </button>
          </li>
          {/* <li className="nav-item dropdown">
            <a
              href="#"
              className="owl-avatar dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://i.pravatar.cc/32?img=users"
                alt="user avatar"
                className="owl-avatar__img"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <div className="dropdown-header h6">Ann Perkins</div>
              </li>
              <li>
                <a href="#" className="dropdown-item">
                  Edit Profile
                </a>
              </li>
              <li className="dropdown-item">
                <div className="form-check form-switch form-check-reverse text-start">
                  <input className="form-check-input" type="checkbox" id="darkMode" />
                  <label className="form-check-label w-100" htmlFor="darkMode">
                    Dark Mode
                  </label>
                </div>
              </li>
              <li className="dropdown-divider" />
              <li>
                <a href="#" className="dropdown-item">
                  Sign Out
                </a>
              </li>
            </ul>
          </li> */}
        </motion.ul>
      </div>
    </motion.nav>
  );
}

export default GlobalToolbar;
