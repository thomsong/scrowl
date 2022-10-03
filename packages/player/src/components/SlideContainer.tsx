import React from "react";

import TemplateCache from "../TemplateCache";

// import "./_slide_template.scss";

const _window: any = window as any;

function SlideContainer(props: any) {
  const courseData = _window.courseData;
  const controller = props.controller;

  const slideData = courseData.slides.reduce((a, slide) => {
    return String(slide.id) === String(props.id) ? slide : a;
  }, null);
  // console.log("slideData", slideData);
  const SlideTemplate = TemplateCache.get(slideData.templateName, slideData.templateVersion);
  const SlideTemplateRender = SlideTemplate && SlideTemplate.render;

  if (!SlideTemplateRender) {
    return null;
  }

  const templateKey = (slideData.templateName + "@" + slideData.templateVersion).replace(
    /[\W_]+/g,
    "-"
  );
  return (
    <SlideTemplateRender
      templateKey={templateKey}
      debug={props.debug}
      locked={props.locked}
      controller={controller}
      slide={slideData}
      id={props.elId}
      onUnlock={props.onUnlock}
    />
  );
}

export default SlideContainer;
