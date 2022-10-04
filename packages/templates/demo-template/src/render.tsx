import { Scrowl } from "embed-host";
import * as React from "react";

import "./style.scss";
import Globe, { GlobeMethods } from "react-globe.gl";
import mapData from "./data";

const anime = require("animejs");
const _window: any = window as any;

function Template(props: any) {
  const editMode = props.editMode ? true : false;

  const slide = props.slide;
  const focusElement = editMode ? props.focusElement : null;
  const scrollScenes: any = React.useRef([]);
  const globeEl = React.useRef();

  React.useEffect(() => {
    if (!globeEl.current) {
      return;
    }
    const globe: GlobeMethods = globeEl.current;

    globe.pointOfView({ lat: 30.6, lng: -118.5, altitude: 4 });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getId(id?: String) {
    if (!id) {
      return props.id;
    }
    return props.id + "-" + id;
  }

  let slideDuration = 4000;

  const handleScrollUpdate = (e: any) => {
    if (!globeEl.current) {
      return;
    }

    if (e.stage === "body") {
      // timeline.current.seek(timeline.current.duration * e.stageProgress);
      const globe: GlobeMethods = globeEl.current;
      const altitude = 4 - 3.5 * e.stageProgress;

      const lat = 30.6 + 9.315311 * e.stageProgress;
      const lng = -118.5 + 37.278043 * e.stageProgress;

      globe.pointOfView({ lat, lng, altitude });
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
  }, []);

  return (
    <Scrowl.Template
      {...props}
      duration={slideDuration}
      ready={true}
      onStateChange={handleStateChange}
      onScroll={handleScrollUpdate}
    >
      <div id={getId("pinned-body")} className={"slide-container "}>
        <div className="content" style={{ pointerEvents: "none" }}>
          <Globe
            // width={window.innerWidth}
            // height={window.innerHeight}
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            labelsData={mapData as any}
            labelLat={(d: any) => d.properties.latitude}
            labelLng={(d: any) => d.properties.longitude}
            labelText={(d: any) => d.properties.name}
            labelSize={(d: any) => Math.sqrt(d.properties.pop_max) * 4e-4}
            labelDotRadius={(d: any) => Math.sqrt(d.properties.pop_max) * 4e-4}
            labelColor={() => "rgba(255, 165, 0, 0.75)"}
            labelResolution={2}
            enablePointerInteraction={false}
            animateIn={false}
          />
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
