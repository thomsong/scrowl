import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import Scrowl from "./Scrowl";
import store from "./store";
import Player from "./Player";

import { LAYOUT_INPUT_TYPE, MIGRATION_HINT } from "embed-host";

const _window: any = window as any;
_window["host"] = {
  Scrowl,
  LAYOUT_INPUT_TYPE,
  MIGRATION_HINT,
};
_window["react"] = React;

window.addEventListener("DOMContentLoaded", (event) => {
  //DOM fully loaded and parsed

  const rootEl: any = document.getElementById("root");

  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<Provider store={store}>{<Player />}</Provider>);
  } else {
    console.error("Error: Missing #root div");
    document.write("Error: Missing #root div");
  }
});
