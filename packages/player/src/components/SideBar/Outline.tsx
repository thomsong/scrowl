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
    _modules: [
      {
        id: 100,
        name: "An Introduction To Harassment & Discrimination",
        time: "20 minutes",
        lessons: [
          {
            id: 1,
            name: "What Is Sexual Harassment?",
            time: "5 minutes",
            state: "complete",
          },

          {
            id: 2,
            name: "Building a Respectful Workplace",
            time: "5 minutes",
          },

          {
            id: 3,
            name: "What to Do If You're Being Sexually Harassed at Work",
            time: "5 minutes",
          },

          {
            id: 4,
            name: "Bystander Intervention",
          },

          {
            id: 5,
            name: "Next Steps",
            state: "locked",
          },
        ],
      },
      {
        id: 200,
        name: "Sexual Harassment",
        time: "20 minutes",
        lessons: [
          {
            id: 11,
            name: "What Is Sexual Harassment?",
            time: "5 minutes",
            state: "complete",
          },

          {
            id: 12,
            name: "Building a Respectful Workplace",
            time: "5 minutes",
          },

          {
            id: 13,
            name: "What to Do If You're Being Sexually Harassed at Work",
            time: "5 minutes",
          },

          {
            id: 14,
            name: "Bystander Intervention",
          },

          {
            id: 15,
            name: "Next Steps",
            state: "locked",
          },
        ],
      },
      {
        id: 300,
        name: "Additional Training For Supervisors",
        time: "15 minutes",
        lessons: [
          {
            id: 21,
            name: "What Is Sexual Harassment?",
            time: "5 minutes",
            state: "complete",
          },

          {
            id: 22,
            name: "Building a Respectful Workplace",
            time: "5 minutes",
          },

          {
            id: 23,
            name: "What to Do If You're Being Sexually Harassed at Work",
            time: "5 minutes",
          },

          {
            id: 24,
            name: "Bystander Intervention",
          },

          {
            id: 25,
            name: "Next Steps",
            state: "locked",
          },
        ],
      },
      {
        id: 400,
        name: "Conclusion",
        time: "5 minutes",
        lessons: [
          {
            id: 31,
            name: "What Is Sexual Harassment?",
            time: "5 minutes",
            state: "complete",
          },

          {
            id: 32,
            name: "Building a Respectful Workplace",
            time: "5 minutes",
          },

          {
            id: 33,
            name: "What to Do If You're Being Sexually Harassed at Work",
            time: "5 minutes",
          },

          {
            id: 34,
            name: "Bystander Intervention",
          },

          {
            id: 35,
            name: "Next Steps",
            state: "locked",
          },
        ],
      },
    ],
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
