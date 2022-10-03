import * as React from "react";

const _window: any = window as any;

let sectionIndex = 100000;

function ScrowlTemplate(props: any) {
  const slideDuration = props.duration || 0;
  const templateSectionId = props.id;

  React.useEffect(() => {
    const controller = props.controller;

    const windowHeight = window.innerHeight;
    const duration = slideDuration + windowHeight * 2;
    let slideVisible: boolean = false;

    const setSlideVisible = (visible: boolean) => {
      if (visible === slideVisible) {
        return;
      }
      slideVisible = visible;

      // console.log("setSlideVisible", slideVisible);
    };

    let sceneTrigger: any;
    let lastStageName = "";
    sceneTrigger = new _window.ScrollMagic.Scene({
      triggerElement: "#" + props.id,
      duration: duration,
      triggerHook: 1,
    })
      .on("progress", function (e: any) {
        const progressPixels = e.progress * duration;

        let stageName = "";
        let stageProgress = 0;
        if (progressPixels <= windowHeight) {
          if (lastStageName === "body") {
            const progressEvent = { progress: e.progress, stage: "body", stageProgress: 0 };
            props.onScroll && props.onScroll(progressEvent);
          }

          stageName = "in_view";
          stageProgress = progressPixels / windowHeight;
        } else if (progressPixels >= duration - windowHeight) {
          if (lastStageName === "body") {
            const progressEvent = { progress: e.progress, stage: "body", stageProgress: 1 };
            props.onScroll && props.onScroll(progressEvent);
          }

          stageName = "out_view";
          stageProgress = (progressPixels - (duration - windowHeight)) / windowHeight;
        } else if (slideDuration > 0) {
          if (lastStageName === "in_view") {
            const progressEvent = { progress: e.progress, stage: "body", stageProgress: 0 };
            props.onScroll && props.onScroll(progressEvent);
          } else if (lastStageName === "out_view") {
            const progressEvent = { progress: e.progress, stage: "body", stageProgress: 1 };
            props.onScroll && props.onScroll(progressEvent);
          }

          stageProgress = (progressPixels - windowHeight) / slideDuration;
          stageName = "body";
        }

        lastStageName = stageName;
        const progressEvent = { progress: e.progress, stage: stageName, stageProgress };

        props.onScroll && props.onScroll(progressEvent);
        //   console.log("Progress", { progress: e.progress, stage: stageName, stageProgress });
      })
      .on("enter leave ", function (e: any) {
        // console.log("slideVisible ", e.type, controller.info("scrollDirection"));

        if (e.type === "enter") {
          setSlideVisible(true);
          props.onStateChange &&
            props.onStateChange({
              state: "visible",
              direction: controller.info("scrollDirection").toLowerCase(),
            });
        } else {
          setSlideVisible(false);
          props.onStateChange &&
            props.onStateChange({
              state: "hidden",
              direction: controller.info("scrollDirection").toLowerCase(),
            });
        }
      })
      // .addIndicators({ name: "scene: BOTTOM " + templateSectionId.current })
      .addTo(controller);

    return () => controller.removeScene(sceneTrigger);
  }, [props, slideDuration, templateSectionId]);

  const templateClass = props.templateKey;

  return (
    <section
      id={templateSectionId}
      className={
        "slide-container " +
        templateClass +
        " " +
        props.className +
        " " +
        (props.editMode ? " edit-mode " : "")
      }
      style={{ height: "calc(100vh + " + slideDuration + "px)" }}
    >
      {props.children}
    </section>
  );
}

export default ScrowlTemplate;
