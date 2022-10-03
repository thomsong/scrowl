/* eslint-disable jsx-a11y/anchor-has-content */
import ScrowlTemplate from "./components/ScrowlTemplate";
import store from "./store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import lottie from "lottie-web";

const a11yEmoji = require("@fec/remark-a11y-emoji");

const courseState = (window as any).courseData;

const Scrowl = {
  Template: ScrowlTemplate,
  lottie,
  ReactMarkdown: (props: any) => (
    <ReactMarkdown
      components={{
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        a: ({ node, ...props }) => <a {...props} target="_blank" />,

        input: ({ node, ...props }) => (
          <input
            {...props}
            disabled={false}
            style={{ pointerEvents: "none", scale: "1.8", margin: "5px 12px 5px 7px" }}
          />
        ),
      }}
      children={props.children}
      remarkPlugins={[remarkGfm, a11yEmoji]}
    />
  ),

  focusOnContent: (fieldName: string) => {
    // Do nothing
  },

  replaceTokens(templateString: string) {
    if (!templateString) {
      return "";
    }

    const { selectedLessonId } = store.getState();
    const selectedLesson = courseState.lessons.reduce((a, p) => {
      return p.id === selectedLessonId ? p : a;
    }, {});

    const selectedModule = courseState.modules.reduce((a, p) => {
      return p.id === selectedLesson.moduleId ? p : a;
    }, {});

    const obj = {
      course: courseState.course,
      module: selectedModule,
      lesson: selectedLesson,
    };
    return templateString.replace(/{(\w+?\.\w+)}/g, function (_, k) {
      const [objectName, objProperty] = k.split(".");

      if (obj[objectName] && typeof obj[objectName][objProperty] !== "undefined") {
        return obj[objectName][objProperty];
      } else {
        return "{" + k + "}";
      }
    });
  },
};

export default Scrowl;
