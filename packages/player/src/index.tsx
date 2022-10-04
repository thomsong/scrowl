import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import Scrowl from "./Scrowl";
import store from "./store";
import Player from "./Player";

const _window: any = window as any;
_window["react"] = React;
_window["host"] = {
  Scrowl,
};

window.addEventListener("DOMContentLoaded", async (event) => {
  const rootEl: any = document.getElementById("root");
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<Provider store={store}>{<Player />}</Provider>);
  } else {
    console.error("Error: Missing #root div");
    document.write("Error: Missing #root div");
  }
});
