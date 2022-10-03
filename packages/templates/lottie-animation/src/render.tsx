import { Scrowl } from "embed-host";
import * as React from "react";

import "./style.scss";

const _window: any = window as any;

function Template(props: any) {
  const editMode = props.editMode ? true : false;

  const slide = props.slide;
  const _content = slide.content || {};
  const content = { duration: 0, alignment: "center", scrollOffset: 0.5, size: "md", ..._content };

  const focusElement = editMode ? props.focusElement : null;
  const scrollScenes: any = React.useRef([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getId(id?: String) {
    if (!id) {
      return props.id;
    }
    return props.id + "-" + id;
  }

  const lottieRef: any = React.useRef();
  const lottieAnimation: any = React.useRef();
  const lottieAnimationDuration: any = React.useRef(0);

  let slideDuration = parseInt(content["duration"]) || 0;
  if (isNaN(slideDuration) || slideDuration < 0) {
    slideDuration = 0;
  }

  // console.log('content["offset"]', content["scrollOffset"]);
  const startOffsetPos = isNaN(content["scrollOffset"]) ? 0.5 : parseFloat(content["scrollOffset"]);
  const endOffsetPos = startOffsetPos;
  const alignClass = content["alignment"] || "center";
  const size = content["size"] || "md";

  // console.log("startOffsetPos", startOffsetPos);
  // console.log("endOffsetPos", endOffsetPos);

  const startOffset = startOffsetPos * window.innerHeight;
  const endOffset = endOffsetPos * window.innerHeight;

  const totalLength = slideDuration + window.innerHeight * 2;
  const totalOffsetLength = totalLength - startOffset - endOffset;

  const handleScrollUpdate = (e: any) => {
    if (!lottieAnimation.current) {
      return;
    }

    let progress = Math.max(
      0,
      Math.min(0.9999, (e.progress * totalLength - startOffset) / totalOffsetLength)
    );

    // Increase resolution of animation
    const frame = Math.floor(lottieAnimationDuration.current * progress * 16) / 16;
    lottieAnimation.current.goToAndStop(frame, true);
  };

  const handleStateChange = (e: any) => {
    if (e.state === "visible") {
      scrollScenes.current.map((scene: any) => scene.enabled(true));
    } else {
      scrollScenes.current.map((scene: any) => scene.enabled(false));
    }
  };

  React.useEffect(() => {
    if (!content["lottie"]) {
      return;
    }

    lottieAnimation.current = Scrowl.lottie.loadAnimation({
      container: lottieRef.current, // the dom element that will contain the animation
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "./course/assets/" + content["lottie"],
    });

    const currentLottieAnimation = lottieAnimation.current;

    const dataReady = () => {
      // console.log("currentLottieAnimation", currentLottieAnimation);

      // console.log("currentLottieAnimation", currentLottieAnimation);
      // currentLottieAnimation
      lottieAnimationDuration.current = currentLottieAnimation.getDuration(true);
      // console.log("duration", lottieAnimationDuration.current);

      currentLottieAnimation.goToAndStop(0, true);
      // animation.stop();
    };

    currentLottieAnimation.addEventListener("data_ready", dataReady);

    return () => {
      currentLottieAnimation.removeEventListener("data_ready", dataReady);
      lottieAnimation.current.destroy();
      lottieAnimation.current = null;
    };
  }, [lottieRef, content["lottie"]]);

  React.useEffect(() => {
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
      props.controller.removeScene(scrollScenes.current);
      scrollScenes.current = [];
    };
  }, []);

  return (
    <Scrowl.Template
      {...props}
      duration={slideDuration}
      onStateChange={handleStateChange}
      onScroll={handleScrollUpdate}
      ready={true}
    >
      <div
        id={getId("pinned-body")}
        aria-label={content["bgImage.alt"]}
        className={"slide-container " + alignClass}
        style={
          content["bgImage.url"]
            ? { backgroundImage: 'url("./course/assets/' + content["bgImage.url"] + '")' }
            : {}
        }
      >
        <div ref={lottieRef} className={"lottie " + size}>
          {editMode && !content["lottie"] ? (
            <div
              style={{
                textAlign: "center",
                height: "30vh",
                paddingTop: "13vh",
                border: "2px dashed #c2c2c2",
              }}
            >
              <span style={{ color: "#9f9f9f" }}>Select an Animation</span>
            </div>
          ) : null}
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
