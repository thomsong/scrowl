import { useState } from "react";
import { motion } from "framer-motion";

function Accordion(props: any) {
  const [isExpanded, setIsExpanded] = useState(props.defaultExpanded ? true : false);

  const bodyAnimations = {
    expanded: {
      display: "block",
      height: "auto",
    },
    collapsed: {
      display: "block",
      height: "0",
      transitionEnd: {
        display: "none",
      },
    },
  };

  return (
    <div className={"accordion-item " + (props.disableCollapse ? " collapse-disabled" : "")}>
      <h2 className="accordion-header" id="panelsStayOpen-headingOne">
        <button
          className={"accordion-button " + (isExpanded ? "" : "collapsed")}
          type="button"
          aria-expanded={isExpanded ? "true" : "false"}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {props.title}
        </button>
      </h2>
      <motion.div
        style={{ overflow: "hidden", height: props.disableCollapse ? "auto" : 0 }}
        className={"accordion-collapse collapse show"}
        variants={bodyAnimations}
        animate={isExpanded ? "expanded" : "collapsed"}
      >
        <div className="accordion-body">{props.children}</div>
      </motion.div>
    </div>
  );
}

export default Accordion;
