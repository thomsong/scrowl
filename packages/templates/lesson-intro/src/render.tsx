import { Scrowl } from "embed-host";

import "./style.scss";

function Template(props: any) {
  const editMode = props.editMode ? true : false;

  const slide = props.slide;
  const content = slide.content || {};

  const focusElement = editMode ? props.focusElement : null;

  return (
    <Scrowl.Template {...props} duration={0} ready={true}>
      <div className="slide-container">
        <div className="layout">
          <header>
            <h1
              className={"can-focus " + (focusElement === "title" && " has-focus")}
              onMouseDown={() => {
                if (editMode) {
                  Scrowl.focusOnContent("title");
                }
              }}
            >
              {Scrowl.replaceTokens(content["title"]) || "Enter Your New Title"}
            </h1>
            <h2>
              <span
                className={"can-focus " + (focusElement === "subtitle" && " has-focus")}
                onMouseDown={() => {
                  if (editMode) {
                    Scrowl.focusOnContent("subtitle");
                  }
                }}
              >
                {Scrowl.replaceTokens(content["subtitle"]) || "Subtitle Goes Here"}
              </span>
            </h2>
            {content["time"] ? (
              <span
                className={"time can-focus " + (focusElement === "time" && " has-focus")}
                onMouseDown={() => {
                  if (editMode) {
                    Scrowl.focusOnContent("time");
                  }
                }}
              >
                <span className="icon">
                  <svg
                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="ScheduleOutlinedIcon"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                  </svg>
                </span>
                <span>{content["time"]}</span>
              </span>
            ) : null}

            {editMode || props.locked ? (
              <button
                className={"can-focus " + (focusElement === "start_label" && " has-focus")}
                onClick={() => {
                  if (editMode) {
                    Scrowl.focusOnContent("start_label");
                  } else {
                    props.onUnlock({ autoScrollToNextSlide: true });
                  }
                }}
              >
                {/* <span className="hide">&lt; </span> */}
                <span className="link">{content["start_label"] || "Start"}</span>
                {/* <span> &gt;</span> */}
              </button>
            ) : (
              <button disabled>
                {/* <span className="hide">&lt; </span> */}
                <span className="link">{content["start_label"] || "Start"}</span>
                {/* <span> &gt;</span> */}
              </button>
            )}
          </header>
          <div
            className="img-container hero can-focus"
            role="img"
            aria-label={content["hero_image.alt"]}
            style={
              content["hero_image.url"]
                ? {
                    backgroundImage: 'url("./course/assets/' + content["hero_image.url"] + '")',
                  }
                : {}
            }
            onMouseDown={() => {
              if (editMode) {
                Scrowl.focusOnContent("hero_image.url");
              }
            }}
          >
            {!content["hero_image.url"] && editMode ? (
              <div
                style={{
                  paddingTop: "40%",
                  width: "100%",
                  height: "100%",
                  border: "2px dashed #c2c2c2",
                }}
              >
                <span style={{ color: "#9f9f9f" }}>Select an Image</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
