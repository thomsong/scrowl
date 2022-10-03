import { Scrowl } from "embed-host";
import * as React from "react";

import "./style.scss";

const anime = require("animejs");

const _window: any = window as any;

function Template(props: any) {
  // console.log("Template locked", props.locked);
  const editMode = props.editMode ? true : false;

  const slide = props.slide; // props.slide
  const _content = slide.content || {};
  const defaults = {
    question: "Your Question Goes Here",
    correctAnswer: "A",
    correctText: "You got it correct!",
    incorrectText: "Please try again...",
    "answers.a": "Answer A",
    "answers.b": "Answer B",
    "answers.c": "Answer C",
    "answers.d": "Answer D",
  };

  const content = { ...defaults, ..._content };
  content.question = content.question || defaults.question;
  content.correctAnswer = content.correctAnswer || defaults.correctAnswer;
  content.correctText = content.correctText || defaults.correctText;
  content.incorrectText = content.incorrectText || defaults.incorrectText;
  content["answers.a"] = content["answers.a"] || defaults["answers.a"];
  content["answers.b"] = content["answers.b"] || defaults["answers.b"];

  const focusElement = editMode ? props.focusElement : null;
  const scrollScenes: any = React.useRef([]);
  const timeline: any = React.useRef();

  const [result, setResult] = React.useState("");

  const question = content.question;
  const correctAnswer = content.correctAnswer;
  const correctText = content.correctText;
  const incorrectText = content.incorrectText;

  const options = [
    {
      letter: "A",
      answer: content["answers.a"],
    },
    {
      letter: "B",
      answer: content["answers.b"],
    },
    {
      letter: "C",
      answer: content["answers.c"],
    },
    {
      letter: "D",
      answer: content["answers.d"],
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getId(id?: String) {
    if (!id) {
      return props.id;
    }
    return props.id + "-" + id;
  }

  let slideDuration = editMode ? 0 : 2000;

  const checkAnswer = () => {
    console.log("checkAnswer");
    const radioVal: any = document.querySelector('input[name="' + getId("radio") + '"]:checked');

    if (radioVal) {
      if (correctAnswer === radioVal.value) {
        setResult("correct");
        timeline.current.seek(timeline.current.duration);
        props.onUnlock({ autoScrollToNextSlide: false });
      } else {
        setResult("incorrect");
      }
    } else {
      setResult("select");
    }
  };

  const handleScrollUpdate = (e: any) => {
    if (result === "correct") {
      return;
    }
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

  React.useEffect(() => {
    timeline.current = anime.timeline({ easing: "easeInOutQuad", autoplay: false });
    const currentTimeline = timeline.current;

    // let target = {
    //   targets: "#" + getId("header"),
    //   opacity: "1",
    //   duration: slideDuration,
    // };

    // currentTimeline.add(target);

    ["A", "B", "C", "D"].map((letter) => {
      // console.log("letter", letter);

      const target = {
        targets: "#" + getId("li-" + letter),
        opacity: "1",
        duration: slideDuration,
      };

      currentTimeline.add(target);
    });

    const target = {
      targets: "#" + getId("submit"),
      opacity: "1",
      duration: slideDuration,
    };

    currentTimeline.add(target);

    return () => {
      currentTimeline.children.map((child: any) => {
        child.remove();
        child.reset();
        currentTimeline.remove(child);
        // console.log("Child", child);
      });
      currentTimeline.reset();

      // console.log("b", currentTimeline.children);
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
      <div id={getId("pinned-body")} className={"slide-container"}>
        <div className="body" style={editMode ? { paddingTop: "7vh" } : {}}>
          {content["title"] ? <h1 className="title">{content["title"]}</h1> : null}
          <h1
            id={getId("header")}
            className={"can-focus " + (focusElement === "question" && " has-focus")}
            onMouseDown={(e) => {
              if (editMode) {
                Scrowl.focusOnContent("question");
              }
            }}
          >
            <Scrowl.ReactMarkdown children={question} />
          </h1>
          <ul className={"options" + (result === "correct" ? " show-results" : "")}>
            {options.map((option) => {
              const optionLetter = option.letter;
              const baseId = getId("radio");
              const focusId = "answers." + optionLetter.toLowerCase();

              return (
                <li
                  style={{
                    opacity: 0,
                    display: content["answers." + optionLetter.toLocaleLowerCase()]
                      ? "block"
                      : "none",
                  }}
                  className={
                    (optionLetter === correctAnswer ? "correct" : "incorrect") +
                    " can-focus " +
                    (focusElement === focusId && " has-focus")
                  }
                  id={getId("li-" + optionLetter)}
                  onMouseDown={(e) => {
                    if (editMode) {
                      e.preventDefault();

                      console.log("focusId", focusId);
                      Scrowl.focusOnContent(focusId);
                    }
                  }}
                >
                  <input
                    style={{ pointerEvents: editMode ? "none" : "all" }}
                    type="radio"
                    id={getId(optionLetter)}
                    name={baseId}
                    value={optionLetter}
                    onClick={(e) => {
                      if (editMode) {
                        e.preventDefault();
                        return;
                      }
                    }}
                    onChange={(e) => {
                      if (editMode) {
                        e.preventDefault();
                        return;
                      }
                      setResult("");
                    }}
                  />
                  <label
                    htmlFor={getId(optionLetter)}
                    style={{ pointerEvents: editMode ? "none" : "all" }}
                  >
                    <span className="letter">{optionLetter}.</span>
                    <span className="answer">{option.answer}</span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div
            className="submit"
            id={getId("submit")}
            style={{ opacity: 0, ...(editMode ? { marginBottom: 0 } : {}) }}
          >
            <button
              disabled={result === "correct" ? true : false}
              onClick={(e) => {
                if (editMode) {
                  e.preventDefault();
                  return;
                }
                checkAnswer();
              }}
            >
              Submit Answer
            </button>
          </div>

          {!result ? <div className="result blank">&nbsp;</div> : null}

          {result === "select" ? (
            <div className="result select-answer">Please select an answer</div>
          ) : null}

          {result === "correct" || editMode ? (
            <div
              className={
                "result correct can-focus " + (focusElement === "correctText" && " has-focus")
              }
              onMouseDown={(e) => {
                if (editMode) {
                  Scrowl.focusOnContent("correctText");
                }
              }}
            >
              {correctText}
            </div>
          ) : null}

          {result === "incorrect" || editMode ? (
            <div
              className={
                "result incorrect can-focus " + (focusElement === "incorrectText" && " has-focus")
              }
              onMouseDown={(e) => {
                if (editMode) {
                  Scrowl.focusOnContent("incorrectText");
                }
              }}
            >
              {incorrectText}
            </div>
          ) : null}
        </div>
      </div>
    </Scrowl.Template>
  );
}

export default Template;
