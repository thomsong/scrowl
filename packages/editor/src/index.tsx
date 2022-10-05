import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import ClientProxy from "./components/SlideRenderer/SlideHost/ClientProxy";
import { store } from "./store";
import { actions as uiActions } from "./store/slices/ui";
import Editor from "./Editor";

(async () => {
  await uiActions.initUI();

  const rootEl = document.getElementById("root");
  if (rootEl) {
    ClientProxy.init();
    ReactDOM.createRoot(rootEl).render(<Provider store={store}>{<Editor />}</Provider>);
  } else {
    console.error("Error: Missing #root div");
    document.write("Error: Missing #root div");
  }
})();
