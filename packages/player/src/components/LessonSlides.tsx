import React, { useState, useRef, useEffect } from "react";

import { useAppSelector } from "../store";

import TemplateCache from "../TemplateCache";
import SlideContainer from "./SlideContainer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const _window: any = window as any;

const loadTemplate = async (templateName, templateVersion) => {
  const requirejs = _window.requirejs;

  const templatePath = "./assets/templates/" + templateName + "@" + templateVersion + "/index.js";

  return new Promise((resolve, reject) => {
    requirejs([templatePath], function (template: any) {
      if (!template) {
        console.error("Error loading template: " + templateName + "@" + templateVersion);
        resolve(false);
        return;
      }

      TemplateCache.set(templateName, templateVersion, template);
      resolve(true);
    });
  });
};

function LessonSlides(props: any) {
  const courseData = _window.courseData;

  const autoScrollTarget = useRef("");
  const [lockedSlideId, setLockedSlideId] = useState(-1);
  const scrollMagicController: any = useRef(new _window.ScrollMagic.Controller());
  const slideMode = useAppSelector((state) => state.slideMode);

  const [templatesLoading, setTemplatesLoading] = useState(true);
  // const [templatesLoading, setTemplatesLoading] = useState(true);

  const lessonSlides = courseData.slides.reduce((collection, slide) => {
    if (slide.lessonId === props.id) {
      collection.push(slide);
      return collection;
    } else {
      return collection;
    }
  }, []);

  const slideTemplates = lessonSlides.reduce((collection: Array<string>, slide) => {
    const newTemplateName = slide.templateName + "@" + slide.templateVersion;

    if (collection.indexOf(newTemplateName) === -1) {
      collection.push(newTemplateName);
      return collection;
    } else {
      return collection;
    }
  }, []);
  // console.log("slideTemplates", slideTemplates);

  // useEffect(() => {

  //   console.log("scrollMagicController.current", scrollMagicController.current);
  //   return () => {
  //     //const controller = new ScrollMagic.Controller();
  //   };
  // }, []);

  useEffect(() => {
    const loadTempalates = async (templates: Array<any>) => {
      for (let i = 0; i < templates.length; i++) {
        const [templateName, templateVersion] = templates[i].split("@");
        // console.log("templateName, templateVersion", templateName, templateVersion);
        await loadTemplate(templateName, templateVersion);
      }

      // console.log("Done Loading templates");
      setTemplatesLoading(false);
    };

    loadTempalates(slideTemplates);
  }, [slideTemplates]);

  useEffect(() => {
    const loadTempalates = async (templates: Array<any>) => {
      for (let i = 0; i < templates.length; i++) {
        const [templateName, templateVersion] = templates[i].split("@");
        // console.log("templateName, templateVersion", templateName, templateVersion);
        await loadTemplate(templateName, templateVersion);
      }

      // console.log("Done Loading templates");
      setTemplatesLoading(false);
    };

    loadTempalates(slideTemplates);
  }, [slideTemplates]);

  if (templatesLoading) {
    return <div className="loading"></div>;
  }

  const updateLockedSlide = (firstUpdate?: boolean) => {
    if (firstUpdate && lockedSlideId !== -1) {
      return;
    }

    if (firstUpdate && _window.courseData.preview.slideId) {
      setLockedSlideId(_window.courseData.preview.slideId);
      return;
    }

    let foundLockedSlide = false;
    let skippedToCurrentLock = lockedSlideId === -1 ? true : false;

    courseData.slides.map((slide: any) => {
      if (foundLockedSlide) {
        return null;
      }

      if (slide.lessonId === props.id) {
        if (skippedToCurrentLock) {
          const slideTemplate = TemplateCache.get(slide.templateName, slide.templateVersion);
          if (slideTemplate && slideTemplate.manifest && slideTemplate.manifest.slideLock) {
            setLockedSlideId(slide.id);
            foundLockedSlide = true;
          }
        }

        if (slide.id === lockedSlideId) {
          skippedToCurrentLock = true;
        }
      }

      return null;
    });

    if (!foundLockedSlide) {
      setLockedSlideId(Number.MAX_VALUE);
    }
  };

  const lessonSlideComponents: any = [];
  let foundLockedSlide = false;

  updateLockedSlide(true);

  let slideIdImmediatelyAfterLocked = "";
  courseData.slides.map((slide) => {
    if (_window.courseData.preview.slideId && slide.id !== _window.courseData.preview.slideId) {
      return null;
    }

    if (slide.lessonId === props.id) {
      if (foundLockedSlide) {
        if (!slideIdImmediatelyAfterLocked) {
          slideIdImmediatelyAfterLocked = slide.id;
        }
        return null;
      }

      if (slide.id === lockedSlideId) {
        foundLockedSlide = true;

        lessonSlideComponents.push(
          <SlideContainer
            key={slide.id}
            id={slide.id}
            elId={"SLIDE-ID-" + slide.id}
            controller={scrollMagicController.current}
            locked={slide.id === lockedSlideId}
            onUnlock={(e: any) => {
              if (e.autoScrollToNextSlide && slideIdImmediatelyAfterLocked) {
                autoScrollTarget.current = slideIdImmediatelyAfterLocked;
              }

              updateLockedSlide();
            }}
          />
        );
      } else {
        lessonSlideComponents.push(
          <SlideContainer
            key={slide.id}
            id={slide.id}
            elId={"SLIDE-ID-" + slide.id}
            controller={scrollMagicController.current}
          />
        );
      }
    }

    return null;
  });

  if (!foundLockedSlide) {
    if (props.lastSlideInCourse) {
      if (_window.courseData.preview) {
        // Don't show in non-course preview
      } else {
        lessonSlideComponents.push(
          <div key="slide-next-lesson" className="continue-slide">
            <button
              onClick={(e: any) => {
                props.finishCourse();
              }}
            >
              <span className="link">Finish Course</span>
              <KeyboardArrowDownIcon />
            </button>
          </div>
        );
      }
    } else {
      if (_window.courseData.preview.lessonId) {
        // Lock to a lesson
      } else {
        const nextLessonName = courseData.lessons.reduce((a, p) => {
          return p.id === props.nextLessionId ? p.name : a;
        }, "");

        lessonSlideComponents.push(
          <div key="slide-next-lesson" className="continue-slide">
            <button
              onClick={() => {
                props.nextSlide();
              }}
            >
              <span className="link">Next Lesson - {nextLessonName}</span>
              <KeyboardArrowDownIcon />
            </button>
          </div>
        );
      }
    }
  }

  if (autoScrollTarget.current) {
    const scrollTargetId = "SLIDE-ID-" + autoScrollTarget.current;
    autoScrollTarget.current = "";

    window.requestAnimationFrame(() => {
      const targetBounds = (document as any).getElementById(scrollTargetId).getBoundingClientRect();
      if (slideMode) {
        window.scrollTo(0, window.scrollY + targetBounds.top);
      } else {
        window.scrollTo({ left: 0, top: window.scrollY + targetBounds.top, behavior: "smooth" });
      }
    });
  }

  return <div className="sld-host">{lessonSlideComponents}</div>;
}

export default LessonSlides;
