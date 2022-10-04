import * as ReactDOM from "react-dom/client";
import * as React from "react";

import ContextWrapper from "./ContextWrapper";
import scrowl from "./Scrowl";
import { LAYOUT_INPUT_TYPE, MIGRATION_HINT } from "./Types";

export * from "./Types";
export const Scrowl = scrowl;

const Host = {
  Scrowl,
  LAYOUT_INPUT_TYPE,
  MIGRATION_HINT,
};

const _window: any = window as any;
// Init it as empty
_window["templates"] = {};
_window["host"] = Host;
_window["react"] = React;

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
