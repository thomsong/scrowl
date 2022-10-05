import { useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import { useAppSelector, useAppDispatch } from "./store/hooks";
import { UI_MODE, actions as uiActions } from "./store/slices/ui";

import FirstWelcome from "./components/FirstWelcome";
import ViewCourses from "./components/ViewCourses";
import EditorDesigner from "./components/EditorDesigner";

import "./style/scrowl.css";
import "./style/override.scss";

function Editor() {
  const dispatch = useAppDispatch();

  const uiMode: any = useAppSelector((state) => state["ui"].mode);
  const courseChanges: any = useAppSelector((state) => state["course"].courseChanges);

  useEffect(() => {
    const onBeforeUnload = (e: any) => {
      e.returnValue = false;

      dispatch(uiActions.handleGlobalAction({ id: "CLOSE_WINDOW" }));
    };

    if (!courseChanges) {
      return () => {};
    }

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseChanges]);

  useEffect(() => {
    const handleMsg = (event: any) => {
      if (event.data === "host_proxy_init") {
        return; // Ignore
      }

      if (event.data.type === "webpackWarnings") {
        return; // Ignore
      }

      if (event.data.action === "GLOBAL_ACTION") {
        dispatch(uiActions.handleGlobalAction(event.data.menuAction));
        return;
      }

      console.warn("Unhandled Window Message", event.data);
    };

    window.addEventListener("message", handleMsg);
    return () => {
      window.removeEventListener("message", handleMsg);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleReadyState = async () => {
      const isFirstLoad = await (window as any).ScrowlApp.settings.get("first_load", true);

      if (isFirstLoad) {
        dispatch(uiActions.setUIMode(UI_MODE.FirstWelcome));
        return;
      }

      // Default to the courses screen
      dispatch(uiActions.setUIMode(UI_MODE.Courses));
    };

    if (uiMode === UI_MODE.Startup) {
      // TODO: Any quick stuff that needs to be done
      dispatch(uiActions.setUIMode(UI_MODE.Loading));
    } else if (uiMode === UI_MODE.Loading) {
      // TODO: Add more ready checks
      document.fonts.ready.then(function () {
        dispatch(uiActions.setUIMode(UI_MODE.Ready));
      });
    } else if (uiMode === UI_MODE.Ready) {
      // We are ready to set the correct UI mode depending
      // on factors such as first load, etc.
      handleReadyState();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiMode]);

  return (
    <>
      <AnimatePresence>{uiMode === UI_MODE.Courses ? <ViewCourses /> : null}</AnimatePresence>
      <AnimatePresence>{uiMode === UI_MODE.FirstWelcome ? <FirstWelcome /> : null}</AnimatePresence>
      {uiMode === UI_MODE.Designer ? <EditorDesigner /> : null}
    </>
  );
}

export default Editor;
