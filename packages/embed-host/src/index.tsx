/* eslint-disable import/first */
import * as ReactDOM from "react-dom/client";
import ContextWrapper from "./ContextWrapper";
export { LAYOUT_INPUT_TYPE } from "editor/src/components/RightPanel/ContentTab/inputs/InputFactory";

export enum MIGRATION_HINT {
  Header = "HEADER",
  SubHeader = "SUB_HEADER",
  BodyText = "BODY_TEXT",
  BodyAlignment = "BODY_ALIGNMENT",
  BulletPointList = "BULLET_POINT_LIST",
  BulletPointCount = "BULLET_POINT_COUNT",
  BulletPoint = "BULLET_POINT",
  Address = "ADDRESS",
  Hero = "HERO",
  Time = "TIME",
}

const _window: any = window as any;

import scrowl from "./Scrowl";
export const Scrowl = scrowl;

_window["scrowl"] = Scrowl;

import * as React from "react";
_window["react"] = React;

// Init it as empty
_window["templates"] = {};

// Needs to be late since it depends on previous imports
import EmbedHost from "./EmbedHost";

// Render to root
const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <ContextWrapper>
      <EmbedHost />
    </ContextWrapper>
  );
} else {
  console.error("Error: Missing #root div");
  document.write("Error: Missing #root div");
}
