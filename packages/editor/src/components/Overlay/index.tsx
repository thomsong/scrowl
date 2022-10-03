import React from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as uiActions } from "./../../store/slices/ui";

import GlossaryEditor from "./overlays/GlossaryEditor";
import ResourceEditor from "./overlays/ResourceEditor";
import TemplateBrowser from "./overlays/TemplateBrowser";

import PublishPanel from "./overlays/PublishPanel";
import PublishProgress from "./overlays/PublishProgress";
import FirstPublish from "./overlays/FirstPublish";

import AssetBrowser from "./overlays/AssetBrowser";

import { motion, AnimatePresence } from "framer-motion";

function Overlay(props: any) {
  const dispatch = useAppDispatch();

  const overlays: any = useAppSelector((state) => state["ui"].overlays);
  const reducedAnimations: any = useAppSelector((state) => state["ui"].reducedAnimations);

  if (!overlays) {
    return <AnimatePresence></AnimatePresence>;
  }

  let zIndexOffset = 1000000;
  const overlayComponents: any = [];
  const backdrops: any = [];

  let overlayIndex = 0;
  overlays.forEach((overlay) => {
    overlayIndex++;
    zIndexOffset += 10;

    let ComponentClass: any = null;

    switch (overlay.mode) {
      case "Glossary":
        ComponentClass = GlossaryEditor;
        break;
      case "Resource":
        ComponentClass = ResourceEditor;
        break;
      case "Publish":
        ComponentClass = PublishPanel;
        break;
      case "PublishProgress":
        ComponentClass = PublishProgress;
        break;
      case "FirstPublish":
        ComponentClass = FirstPublish;
        break;
      case "AssetBrowser":
        ComponentClass = AssetBrowser;
        break;
      case "TemplateBrowser":
        ComponentClass = TemplateBrowser;
        break;

      case "dialog":
        // Do Nothing
        break;
      default:
        console.error("Unhandled overlay", overlay);
    }

    if (ComponentClass) {
      overlayComponents.push(
        <ComponentClass
          reducedAnimations={reducedAnimations}
          key={"overlay-" + zIndexOffset}
          data={overlay.data || {}}
          zIndex={zIndexOffset + 1}
          topOverlay={overlays.length === overlayIndex}
        />
      );
    }

    backdrops.push(
      <motion.div
        key={"overlay-backdrop-" + zIndexOffset}
        style={{
          zIndex: zIndexOffset,
        }}
        className="offcanvas-backdrop fade show"
        onClick={() => {
          if (overlay.data.canClose === false) {
            return;
          }
          dispatch(uiActions.closeOverlay(true));
        }}
        transition={reducedAnimations ? {} : { opacity: { delay: 0, duration: 0.05 } }}
        initial={reducedAnimations ? {} : { opacity: 0 }}
        animate={reducedAnimations ? {} : { opacity: 0.5 }}
        exit={reducedAnimations ? {} : { opacity: 0 }}
      />
    );
  });

  return (
    <AnimatePresence>
      {overlayComponents}
      {backdrops}
    </AnimatePresence>
  );
}

export default Overlay;
