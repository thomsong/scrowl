import SideBar from "./components/SideBar";
import LessonSlides from "./components/LessonSlides";
import ScrollHint from "./components/ScrollHint";

import { useAppSelector, useAppDispatch, actions } from "./store";

import "./styles/Player.scss";
import { useEffect, useState } from "react";

function Player() {
  const dispatch = useAppDispatch();

  const courseState: any = (window as any).courseData;
  if (!courseState.publish) {
    courseState.publish = {};
  }

  const sideBarExpanded = useAppSelector((state) => state.sideBarExpanded);
  const selectedLessonId = useAppSelector((state) => state.selectedLessonId);
  const slideMode = useAppSelector((state) => state.slideMode);

  const [currentLessonId, setCurrentLessonId] = useState(0);

  useEffect(() => {
    // Update the window title with course/module/lesson
    courseState.course.name = courseState.publish.name || courseState.course.name;
    document.title = courseState.course.name;
  }, []);

  useEffect(() => {
    if (currentLessonId !== selectedLessonId) {
      setCurrentLessonId(selectedLessonId);
    }
  }, [currentLessonId, selectedLessonId]);

  useEffect(() => {
    const nextSlide = () => {
      window.scrollTo(
        0,
        window.innerHeight + Math.round(window.scrollY / window.innerHeight) * window.innerHeight
      );
    };

    const prevSlide = () => {
      window.scrollTo(
        0,
        -window.innerHeight + Math.round(window.scrollY / window.innerHeight) * window.innerHeight
      );
    };

    const handleKeyPress = (e: any) => {
      console.log("handleKeyPress", e.key);
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          prevSlide();
          break;
        case "ArrowRight":
        case "ArrowDown":
          nextSlide();
          break;
        default:
        // Do Nothing
      }
    };

    if (slideMode) {
      // Snap
      window.scrollTo(0, Math.round(window.scrollY / window.innerHeight) * window.innerHeight);
      document.body.classList.add("scroll-lock");
      window.addEventListener("keydown", handleKeyPress);

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    } else {
      document.body.classList.remove("scroll-lock");
    }
  }, [slideMode, sideBarExpanded]);

  const getNextLessionId = () => {
    let newLessonId = -1;

    const currentLesson = courseState.lessons.reduce((a, p) => {
      return p.id === selectedLessonId ? p : a;
    }, {});
    const currentModule = courseState.modules.reduce((a, p) => {
      return p.id === currentLesson.moduleId ? p : a;
    }, {});

    let currentLessonFound = false;
    const nextModuleLessonId = courseState.lessons.reduce((a, p) => {
      const newVal = p.moduleId === currentModule.id && currentLessonFound && a === -1 ? p.id : a;

      if (p.id === currentLesson.id) {
        currentLessonFound = true;
      }
      return newVal;
    }, -1);

    // console.log("nextModuleLessonId", nextModuleLessonId);

    if (nextModuleLessonId === -1) {
      // Last lesson in module

      if ((window as any).courseData.preview.moduleId) {
        return -1;
      }

      let moduleFound = false;
      const nextModuleId = courseState.modules.reduce((a, p) => {
        const newVal = moduleFound && a === -1 ? p.id : a;

        if (p.id === currentModule.id) {
          moduleFound = true;
        }
        return newVal;
      }, -1);

      if (nextModuleId === -1) {
        newLessonId = -1;
      } else {
        newLessonId = courseState.lessons.reduce((a, p) => {
          return p.moduleId === nextModuleId && a === -1 ? p.id : a;
        }, -1);
      }
    } else {
      newLessonId = nextModuleLessonId;
    }

    return newLessonId;
  };

  const nextLessionId = getNextLessionId();

  // console.log("nextLessionId", nextLessionId);
  return (
    <div className="player">
      <SideBar />
      <ScrollHint />
      {currentLessonId === selectedLessonId ? (
        <LessonSlides
          id={currentLessonId}
          lastSlideInCourse={nextLessionId === -1 ? true : false}
          nextSlide={() => {
            // console.log("newLessonId", nextLessionId);
            if (nextLessionId) {
              dispatch(actions.selectLesson(nextLessionId));
            }
          }}
          nextLessionId={nextLessionId}
          finishCourse={() => {
            // console.log("finishCourse");
            window.close();
          }}
        />
      ) : null}
    </div>
  );
}

export default Player;
