import { useState } from "react";
import { useAppSelector, useAppDispatch, actions } from "../../store";

import ScheduleIcon from "@mui/icons-material/Schedule";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function Outline(props: any) {
  const _window = window as any;

  const dispatch = useAppDispatch();

  const [expandedModules, setExpandedModules] = useState({});

  const courseState = (window as any).courseData;

  const selectedLessonId = useAppSelector((state) => state.selectedLessonId);

  const unlockedProgressModuleId = 5;
  const unlockedProgressLessonId = 3;

  let outlineData: any = {
    name: courseState.course.name,
    subtitle: (courseState.publish && courseState.publish.description) || "",
    // time: "60 minutes",
    modules: [],
  };

  courseState.modules.map((module) => {
    const moduleData = { ...module };
    moduleData.lessons = [];
    // moduleData.time = null;
    courseState.lessons.map((lesson) => {
      if (lesson.moduleId === module.id) {
        moduleData.lessons.push(lesson);
      }

      return null;
    });
    outlineData.modules.push(moduleData);

    return null;
  });
  outlineData.subtitle = "Subtitle Here";
  outlineData.time = "60 Minutes";

  return (
    <div className="SideBarOverviewPanel" style={{ display: props.active ? "block" : "none" }}>
      <header>
        <h1>{outlineData.name}</h1>
        <h2>{outlineData.subtitle}</h2>
        {outlineData.time ? (
          <span className="time">
            <ScheduleIcon />
            {outlineData.time}
          </span>
        ) : null}
      </header>
      <div className="modules">
        {outlineData.modules.map((module: any) => {
          let containsCurrentLesson = module.lessons
            ? module.lessons.reduce((a, lesson) => {
                return lesson.id === selectedLessonId || a;
              }, false)
            : false;

          let moduleExpanded = expandedModules[module.id] ? true : containsCurrentLesson;

          const moduleAvailable =
            _window.courseData.preview.moduleId && _window.courseData.preview.moduleId !== module.id
              ? false
              : true;

          if (!moduleAvailable) {
            moduleExpanded = false;
          }
          //expandedModules
          return (
            <div
              key={module.id}
              className={
                "module" +
                (moduleExpanded ? " expanded " : "") +
                (moduleAvailable ? "" : " not-available ")
              }
              aria-expanded="true"
            >
              <button
                className="title"
                onClick={() => {
                  if (containsCurrentLesson) {
                    return;
                  }
                  const newExpandedState = { ...expandedModules };

                  if (newExpandedState[module.id]) {
                    delete newExpandedState[module.id];
                  } else {
                    newExpandedState[module.id] = true;
                  }
                  setExpandedModules(newExpandedState);
                  // toggle expanded
                }}
              >
                {moduleExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}

                <span style={{ fontWeight: 600 }}>
                  {module.name}
                  {module.time ? (
                    <span className="time">
                      <ScheduleIcon />
                      {module.time}
                    </span>
                  ) : null}
                </span>
              </button>

              <ul className="lessons">
                {module.lessons &&
                  module.lessons.map((lesson) => {
                    let lessonState = lesson.state || "open";
                    if (lesson.id === selectedLessonId) {
                      lessonState = "active";
                    }

                    let className = "";
                    let buttonDiabled = false;
                    let icon = <RadioButtonUncheckedIcon />;
                    let iconClass = "radio";

                    if (lessonState === "locked") {
                      buttonDiabled = true;
                      className = "locked";
                    } else if (lessonState === "open") {
                      className = "checked";
                    } else if (lessonState === "active") {
                      className = "active";
                      icon = <ArrowCircleRightOutlinedIcon />;
                      iconClass = "active";
                    } else if (lessonState === "complete") {
                      className = "checked";
                      icon = <CheckCircleOutlinedIcon />;
                      iconClass = "complete";
                    }

                    const lessonAvailable =
                      _window.courseData.preview.lessonId &&
                      _window.courseData.preview.lessonId !== lesson.id
                        ? false
                        : true;

                    return (
                      <li
                        key={lesson.id}
                        className={className + (lessonAvailable ? "" : " not-available ")}
                      >
                        <button
                          disabled={buttonDiabled}
                          onClick={() => {
                            dispatch(actions.selectLesson(lesson.id));
                            dispatch(actions.closeSidePanel());
                          }}
                        >
                          <span className={"status " + iconClass}>{icon}</span>
                          <span>{lesson.name}</span>
                        </button>
                        {lesson.time ? (
                          <span className="time">
                            <ScheduleIcon />
                            {lesson.time}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Outline;
