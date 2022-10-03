import { Scrowl } from "embed-host";
import * as React from "react";

import "./style.scss";

const anime = require("animejs");
const _window: any = window as any;

function Template(props: any) {
  const editMode = props.editMode ? true : false;

  const slide = props.slide;
  const content = slide.content || {};
  const focusElement = editMode ? props.focusElement : null;

  let useImageAsBG = content["bgImage.bg"] ? true : false;
  let showProgressBar = content["options.showProgress"] ? true : false;
  let alignment = content["options.alignment"] || "left";

  const slideDuration = showProgressBar ? 1000 : 0;

  const scrollScenes: any = React.useRef([]);
  const timeline: any = React.useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getId(id?: String) {
    if (!id) {
      return props.id;
    }
    return props.id + "-" + id;
  }

  const handleScrollUpdate = (e: any) => {
    if (e.stage === "body") {
      timeline.current.seek(timeline.current.duration * e.stageProgress);
    }
  };

  const handleStateChange = (e: any) => {
    if (e.state === "visible") {
      scrollScenes.current.map((scene: any) => scene.enabled(true));
    } else {
      scrollScenes.current.map((scene: any) => scene.enabled(false));
    }
  };

  React.useEffect(() => {
    if (!showProgressBar) {
      return () => {};
    }

    scrollScenes.current.push(
      new _window.ScrollMagic.Scene({
        triggerElement: "#" + getId(),
        duration: slideDuration,
        offset: 0,
        triggerHook: 0,
      })
        .setPin("#" + getId("pinned-body"), { pushFollowers: false })
        // .addIndicators()
        .addTo(props.controller)
        .enabled(false)
    );

    timeline.current = anime.timeline({ easing: "easeInOutQuad", autoplay: false });
    const currentTimeline = timeline.current;
    const target = {
      targets: "#" + getId("bar"),
      width: "100%",
      duration: slideDuration,
    };

    currentTimeline.add(target);

    return () => {
      props.controller.removeScene(scrollScenes.current);
      scrollScenes.current = [];

      currentTimeline.children.map((child: any) => {
        child.remove(target);
        child.reset();
        currentTimeline.remove(child);
        // console.log("Child", child);
      });
      currentTimeline.reset();

      // console.log("b", currentTimeline.children);
    };
  }, [showProgressBar]);

  let contentText = content["text"];
  if (!contentText) {
    contentText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  }

  return (
    <Scrowl.Template
      {...props}
      className={showProgressBar ? " show-progress" : ""}
      duration={slideDuration}
      onStateChange={handleStateChange}
      onScroll={handleScrollUpdate}
      ready={true}
    >
      <div className="slide-container">
        <div
          id={getId("pinned-body")}
          className="hero "
          aria-label={useImageAsBG ? content["bgImage.alt"] : ""}
          style={
            useImageAsBG && content["bgImage.url"]
              ? {
                  width: "100vw",
                  height: "100vh",
                  backgroundImage: 'url("./course/assets/' + content["bgImage.url"] + '")',
                }
              : {}
          }
        >
          {useImageAsBG ? <div className="overlay" /> : null}

          <div className={"text " + (alignment === "right" ? " right" : "")}>
            <div className="wrapper">
              <hr id={getId("bar")} style={{ width: showProgressBar ? "0%" : "100%" }} />
              <p
                className={"can-focus " + (focusElement === "text" && " has-focus")}
                onMouseDown={() => {
                  if (editMode) {
                    Scrowl.focusOnContent("text");
                  }
                }}
              >
                <Scrowl.ReactMarkdown children={contentText} />
              </p>
            </div>
          </div>

          {useImageAsBG ? null : (
            <div
              role="img"
              aria-label={content["hero_image.alt"]}
              className={
                "img " +
                (alignment === "right" ? " right" : "") +
                " can-focus " +
                (focusElement === "bgImage.url" && " has-focus")
              }
              onMouseDown={() => {
                if (editMode) {
                  Scrowl.focusOnContent("bgImage.url");
                }
              }}
              style={
                content["bgImage.url"]
                  ? { backgroundImage: 'url("./course/assets/' + content["bgImage.url"] + '")' }
                  : {}
              }
            />
          )}
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
