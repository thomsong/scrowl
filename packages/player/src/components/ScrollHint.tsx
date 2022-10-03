import React from "react";

import { useAppSelector } from "../store";

const STAGE_1_IDLE_TIME = 5;
const STAGE_2_IDLE_TIME = 10;

function ScrollHint(props: any) {
  const sideBarExpanded = useAppSelector((state) => state.sideBarExpanded);
  const slideMode = useAppSelector((state) => state.slideMode);

  const [idleTime, setIdleTime] = React.useState(0);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handle = setInterval(() => {
      if (lastScrollY.current !== window.scrollY) {
        lastScrollY.current = window.scrollY;
        setIdleTime(0);
        return;
      }

      if (sideBarExpanded) {
        setIdleTime(0);
        return;
      }

      if (slideMode) {
        setIdleTime(0);
        return;
      }

      const atMaxScroll = window.scrollY + window.innerHeight >= document.body.scrollHeight - 1;
      if (atMaxScroll) {
        setIdleTime(0);
        return;
      }

      setIdleTime((current) => {
        return current + 0.5;
      });
    }, 500);

    return () => {
      clearTimeout(handle);
    };
  }, [sideBarExpanded, slideMode]);

  return (
    <div className={"ScrollHint " + (idleTime >= STAGE_1_IDLE_TIME ? " visible" : "")}>
      <div className={"hint-text " + (idleTime >= STAGE_2_IDLE_TIME ? " visible" : "")}>
        <span>Scroll To Continue</span>
      </div>
      <div className="icon-scroll" />
    </div>
  );
}

export default ScrollHint;
