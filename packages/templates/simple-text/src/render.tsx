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
  const scrollScenes: any = React.useRef([]);
  const timeline: any = React.useRef();

  const animateLists = content.animateLists || "";
  const alignment = content.alignment || "justify";
  const bodyText =
    content.body ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getId(id?: String) {
    if (!id) {
      return props.id;
    }
    return props.id + "-" + id;
  }

  let slideDuration = animateLists ? 2000 : 0;

  const handleScrollUpdate = (e: any) => {
    if (!animateLists) {
      return;
    }

    if (e.stage === "body" && timeline.current) {
      timeline.current.seek(timeline.current.duration * e.stageProgress);
    }
  };

  const handleStateChange = (e: any) => {
    if (!animateLists) {
      return;
    }

    if (e.state === "visible") {
      scrollScenes.current.map((scene: any) => scene.enabled(true));
    } else {
      scrollScenes.current.map((scene: any) => scene.enabled(false));
    }
  };

  React.useEffect(() => {
    if (!animateLists) {
      return;
    }

    scrollScenes.current.push(
      new _window.ScrollMagic.Scene({
        triggerElement: "#" + getId(),
        duration: slideDuration + 0.01,
        offset: 0,
        triggerHook: 0,
      })
        .setPin("#" + getId("pinned-body"), { pushFollowers: false })
        // .addIndicators()
        .addTo(props.controller)
        .enabled(true) //false)
    );

    return () => {
      scrollScenes.current.forEach((scene) => {
        scene.destroy(true);
        props.controller.removeScene(scene);
      });

      scrollScenes.current = [];
    };
  }, [animateLists]);

  React.useEffect(() => {
    if (!animateLists) {
      return;
    }
    let selectors: any = [];

    switch (animateLists) {
      case "lists":
        selectors.push("#" + getId("pinned-body") + " li");
        break;
      case "paragraphs":
        selectors.push("#" + getId("pinned-body") + " p");
        break;
      case "all":
        selectors.push("#" + getId("pinned-body") + " li");
        selectors.push("#" + getId("pinned-body") + " p");
        selectors.push("#" + getId("pinned-body") + " hr");
        selectors.push("#" + getId("pinned-body") + " blockquote");
        break;
    }

    if (!selectors.length) {
      return;
    }

    const listItems: any = (document as any).querySelectorAll(selectors.join(", "));

    if (!listItems) {
      return;
    }

    timeline.current = anime.timeline({ easing: "easeInOutQuad", autoplay: false });
    const currentTimeline = timeline.current;

    console.log("listItems", listItems);

    [...listItems].map((item: any) => {
      item.style.opacity = 0;
      item.style.transform = "translateX(200px)";
      const target = {
        targets: item,
        opacity: "1",
        translateX: "0",
        duration: 100,
      };

      currentTimeline.add(target);

      return null as any;
    });

    const target = {
      duration: 100,
    };

    currentTimeline.add(target);

    const frozenListItems = selectors.join(", ");
    return () => {
      currentTimeline.children.map((child: any) => {
        child.remove();
        child.reset();
        currentTimeline.remove(child);
        // console.log("Child", child);
      });
      currentTimeline.reset();

      const listItems: any = (document as any).querySelectorAll(frozenListItems);
      [...listItems].map((item: any) => {
        item.style.opacity = 1;
        item.style.transform = "";
        return null;
      });

      // console.log("b", currentTimeline.children);
    };
  }, [animateLists]);

  return (
    <Scrowl.Template
      {...props}
      duration={slideDuration}
      ready={true}
      onStateChange={handleStateChange}
      onScroll={handleScrollUpdate}
    >
      <div id={getId("pinned-body")} className={"slide-container "}>
        <div className="content">
          <div
            className="hero "
            aria-label={content["bgImage.alt"] || ""}
            style={
              content["bgImage.url"]
                ? {
                    width: "100vw",
                    height: "100vh",
                    backgroundImage: 'url("./course/assets/' + content["bgImage.url"] + '")',
                  }
                : {}
            }
          >
            {content["bgImage.url"] ? <div className="overlay" /> : null}
          </div>
          {bodyText && bodyText !== "#" ? (
            <div
              style={{ textAlign: alignment }}
              className={"body can-focus " + (focusElement === "body" && " has-focus")}
              onMouseDown={() => {
                if (editMode) {
                  Scrowl.focusOnContent("body");
                }
              }}
            >
              <Scrowl.ReactMarkdown children={bodyText} />
            </div>
          ) : null}
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
