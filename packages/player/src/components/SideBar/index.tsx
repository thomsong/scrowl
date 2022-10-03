import React, { useState, useRef, useEffect } from "react";

import { useAppSelector, useAppDispatch, actions } from "../../store";

import Outline from "./Outline";
import Glossary from "./Glossary";
import Resources from "./Resources";

import BarsRegularIcon from "../../icons/bars-regular.svg";

function SideBar(props: any) {
  const dispatch = useAppDispatch();

  const resources: any = (window as any).courseData.resources;
  const glossaryTerms: any = (window as any).courseData.glossaryTerms;

  const sideBarExpanded = useAppSelector((state) => state.sideBarExpanded);
  const slideMode = useAppSelector((state) => state.slideMode);

  const [selectedTab, setSelectedTab] = useState("outline");
  const sideBarOverlayRef: any = useRef();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if ((document as any).activeElement.tagName === "INPUT") {
        return;
      }

      switch (event.code) {
        case "KeyM":
          if (sideBarExpanded) {
            dispatch(actions.closeSidePanel());
          } else {
            dispatch(actions.openSidePanel());
          }
          break;
        case "Escape":
          if (sideBarExpanded) {
            dispatch(actions.closeSidePanel());
          }
          break;
        default:
          break;
      }
    };

    const handleWindowScroll = (event: any) => {
      dispatch(actions.closeSidePanel());
    };

    const currentSideBarOverlayRef = sideBarOverlayRef.current;

    if (sideBarExpanded) {
      document.body.classList.add("scroll-lock");

      if (currentSideBarOverlayRef) {
        currentSideBarOverlayRef.addEventListener("mousewheel", handleWindowScroll);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("scroll-lock");
      window.removeEventListener("keydown", handleKeyDown);

      if (currentSideBarOverlayRef) {
        currentSideBarOverlayRef.removeEventListener("mousewheel", handleWindowScroll);
      }
    };
  }, [dispatch, sideBarExpanded, sideBarOverlayRef]);

  return (
    <>
      <button
        className="SideBar menu-button"
        onClick={(e: any) => {
          if (sideBarExpanded) {
            dispatch(actions.closeSidePanel());
          } else {
            dispatch(actions.openSidePanel());
          }
          e.target.blur();
        }}
        aria-label="Show Menu (m)"
        title="Show Menu (m)"
      >
        <img src={BarsRegularIcon} alt="Toggle Menu" />
        <div className="bg"></div>
      </button>

      <div className={"SideBarMenu " + (sideBarExpanded ? " expanded" : "")}>
        <div className="body">
          <nav className="SideBarNav">
            <ul>
              <li className={selectedTab === "outline" ? "active" : ""}>
                <button
                  onClick={() => {
                    setSelectedTab("outline");
                  }}
                >
                  Outline
                </button>
              </li>

              {resources.length ? (
                <li className={selectedTab === "resources" ? "active" : ""}>
                  <button
                    onClick={() => {
                      setSelectedTab("resources");
                    }}
                  >
                    Resources
                  </button>
                </li>
              ) : null}

              {glossaryTerms.length ? (
                <li className={selectedTab === "glossary" ? "active" : ""}>
                  <button
                    onClick={() => {
                      setSelectedTab("glossary");
                    }}
                  >
                    Glossary
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>

          <Outline active={selectedTab === "outline"} />
          {resources.length ? <Resources active={selectedTab === "resources"} /> : null}
          {glossaryTerms.length ? <Glossary active={selectedTab === "glossary"} /> : null}
        </div>
        {/* <div className="toggle-slideshow-mode">
          <input
            type="checkbox"
            checked={slideMode}
            onChange={(e) => {
              dispatch(actions.setSlideMode(e.target.checked));
            }}
          />
          <label>Slide mode</label>
        </div> */}
      </div>

      {sideBarExpanded ? (
        <div
          ref={sideBarOverlayRef}
          className="SideBar overlay"
          onMouseDown={() => {
            dispatch(actions.closeSidePanel());
          }}
        />
      ) : null}
    </>
  );
}

export default SideBar;
