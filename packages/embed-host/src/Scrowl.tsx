/* eslint-disable jsx-a11y/anchor-has-content */

import ScrowlTemplate from "./ScrowlTemplate";
import HostProxy from "./HostProxy";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// const a11yEmoji = require("@fec/remark-a11y-emoji"); // Not needed in editor
import lottie from "lottie-web";

class Scrowl {
  public Template = ScrowlTemplate;
  public host: HostProxy;
  public tokenObject: any = {};
  public ReactMarkdown;
  public lottie;

  constructor() {
    this.host = new HostProxy();

    this.lottie = lottie;

    this.ReactMarkdown = (props: any) => (
      <ReactMarkdown
        components={{
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          a: ({ node, ...props }) => (
            <a
              onClick={(e) => {
                e.preventDefault();
              }}
              {...props}
              target="_blank"
            />
          ),

          input: ({ node, ...props }) => (
            <input
              {...props}
              disabled={false}
              style={{ pointerEvents: "none", scale: "1.8", margin: "5px 12px 5px 7px" }}
            />
          ),
        }}
        children={props.children}
        remarkPlugins={[remarkGfm]} // a11yEmoji Not needed in editor
      />
    );
  }

  focusOnContent(fieldName: string) {
    this.host.sendMessage("template.setContentPanelFocus", fieldName);
  }

  replaceTokens(templateString: string) {
    if (!templateString) {
      return "";
    }

    const obj = this.tokenObject;
    return templateString.replace(/{(\w+?\.\w+)}/g, function (_, k) {
      const [objectName, objProperty] = k.split(".");

      if (obj[objectName] && typeof obj[objectName][objProperty] !== "undefined") {
        return obj[objectName][objProperty];
      } else {
        return "{" + k + "}";
      }
    });
  }
}

const scrowlInstance = new Scrowl();
export default scrowlInstance;
