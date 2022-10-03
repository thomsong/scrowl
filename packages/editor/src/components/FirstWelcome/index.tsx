import React, { useState } from "react";

import "../../style/first-welcome.scss";
import HelloEnvelope from "../../components/animations/HelloEvelope";

import { useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";
import { actions as courseActions } from "./../../store/slices/course";

import { motion } from "framer-motion";

function FirstWelcome(props: any) {
  const dispatch = useAppDispatch();

  const [hasClicked, setHasClicked] = useState(false);

  // console.log("hasClicked", hasClicked);

  const createFirstCourse = async () => {
    if (hasClicked) {
      return;
    }

    setHasClicked(true);

    const result = await (window as any).ScrowlApp.course.newCourse("welcome");
    await dispatch(courseActions.loadCourse(result.id));
    dispatch(uiActions.createFirstCourse());
  };
  return (
    <motion.div
      className="first-welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      exit={{ opacity: 0, transition: { delay: 0.2 } }}
      style={hasClicked ? { pointerEvents: "none" } : {}}
    >
      <div className="body">
        <motion.h1
          initial={{ transform: "translate(0,-80px)" }}
          animate={{ transform: "translate(0,0px)" }}
          transition={{ duration: 0.5 }}
          exit={{ transform: "translate(0,-150px)", opacity: 0, transition: { delay: 0.1 } }}
        >
          Create the future, in Scrowl
        </motion.h1>
        <motion.h2
          initial={{ transform: "translate(0,-180px)" }}
          animate={{ transform: "translate(0,0px)" }}
          transition={{ duration: 0.5 }}
          exit={{ transform: "translate(0,-110px)", opacity: 0, transition: { delay: 0.1 } }}
        >
          Unleash your imagination and get ready to design your best course ever.
        </motion.h2>
        <motion.button
          className="btn btn-primary btn-lg"
          onMouseDown={() => createFirstCourse()}
          onClick={() => createFirstCourse()}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.1 },
          }}
          animate={hasClicked ? { boxShadow: "0 0 0 30px rgba(0, 122, 186, 0)" } : { scale: 1 }}
          transition={
            hasClicked
              ? {
                  boxShadow: {
                    duration: 0.3,
                    from: "0 0 0 4px rgba(0, 122, 186, 0.5)",
                  },
                }
              : {
                  from: 1.03,
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.7,
                }
          }
        >
          Design My First Course
        </motion.button>

        <motion.div
          className="hello-animation"
          style={{ cursor: "pointer" }}
          onMouseDown={() => createFirstCourse()}
          onClick={() => createFirstCourse()}
          exit={{ transform: "translate(0,50vh)", transition: { delay: 0.3 } }}
        >
          <HelloEnvelope />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default FirstWelcome;
