import { useEffect, useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as leftPanelActions } from "../../store/slices/ui/leftPanel";
import { motion } from "framer-motion";

import { _p } from "../../utils";

// import SearchBar from "./SearchBar";

import Outline from "./Outline";
import Resources from "./Resources";
import Glossary from "./Glossary";

function LeftPanel(props: any) {
  const dispatch = useAppDispatch();

  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);
  const animationDelay: any = useAppSelector((state) => state["ui"].animationDelay);

  const grabHandleRef: any = useRef();

  const [panelWidth, setPanelWidth] = useState(325);

  useEffect(() => {
    const localGrabHandleRef = grabHandleRef.current;

    const setWidthStyle = (newWidth) => {
      let minWidth = 200;
      let maxWidth = window.innerWidth / 3;

      if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      document.documentElement.style.setProperty("--left-panel-width", newWidth + "px");

      return newWidth;
    };

    const mouseMoveHandler = (event) => {
      event.preventDefault();

      let newWidth = setWidthStyle(event.clientX);
      setPanelWidth(newWidth);
    };

    const mouseUpHandler = (event) => {
      document.documentElement.style.setProperty("--dragging-pointer-events", "");
      event.preventDefault();

      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    const mouseDownHandler = (event) => {
      document.documentElement.style.setProperty("--dragging-pointer-events", "none");
      event.preventDefault();

      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", mouseUpHandler);
    };

    const windowResizeHandler = (event) => {
      // Attempt to reduce side panel width
      let currentWidth = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--left-panel-width")
      );

      let newWidth = setWidthStyle(currentWidth);
      setPanelWidth(newWidth);
    };

    localGrabHandleRef.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("resize", windowResizeHandler);

    let newWidth = setWidthStyle(panelWidth);
    setPanelWidth(newWidth);

    // cleanup
    return () => {
      localGrabHandleRef.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("resize", windowResizeHandler);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let selectedTabName = useAppSelector((state) => state["ui/leftPanel"].selectedTab);

  const tabNames = ["Outline", "Resources", "Glossary"];

  const container = {
    show: {
      transition: {
        delayChildren: animationDelay,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, transform: "translate(-30px,0px)" },
    show: {
      opacity: 1,
      transform: "translate(0px,0px)",
      transitionEnd: { opacity: "", transform: "" },
    },
  };

  return (
    <motion.div
      className="owl-pane scrowl__leftbar support-high-contrast"
      initial={
        reducedAnimations
          ? {}
          : {
              boxShadow: "-30px 0 0px 0 var(--owl-sidebar-bg)",
              marginBottom: "-32px",
              transform: "translate( -350px ,0px)",
            }
      }
      animate={
        reducedAnimations
          ? {}
          : {
              marginBottom: "0px",
              transform: "translate(0px,0px)",
              transition: {
                marginBottom: { delay: animationDelay, duration: 0.4 },
                transform: { delay: animationDelay },
              },
              transitionEnd: { transform: "", marginBottom: "", boxShadow: "" },
            }
      }
    >
      <div className="scrowl__leftbar__header">
        {/* <SearchBar /> */}
        <motion.ul
          className="nav nav-tabs"
          role="tablist"
          variants={reducedAnimations ? {} : container}
          initial="hidden"
          animate="show"
        >
          {tabNames.map((tabName) => {
            const tabIsSelected = tabName === selectedTabName;
            return (
              <motion.li
                key={tabName}
                className="nav-item"
                role="presentation"
                variants={reducedAnimations ? {} : item}
              >
                <button
                  className={"nav-link " + (tabIsSelected ? "active" : "")}
                  {..._p("onClick", "onContextMenu", () =>
                    dispatch(leftPanelActions.setPanelTab(tabName))
                  )}
                >
                  {tabName}
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
      <div className="tab-content scrowl__leftbar__content">
        <Outline key="Outline" active={selectedTabName === "Outline"} />
        <Resources key="Resources" active={selectedTabName === "Resources"} />
        <Glossary key="Glossary" active={selectedTabName === "Glossary"} />
      </div>
      <div ref={grabHandleRef} className="owl-grabhandle owl-grabhandle--left">
        <div />
      </div>
    </motion.div>
  );
}

export default LeftPanel;
