import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import ClientProxy from "./components/SlideRenderer/SlideHost/ClientProxy";
import { store } from "./store";
import Editor from "./Editor";

const rootEl = document.getElementById("root");
const _window = window as any;

(async () => {
  _window.nativeTheme = await _window.ScrowlApp.getNativeTheme();
  _window.prefersReducedMotion = _window.ScrowlApp.prefersReducedMotion();

  // This is an ugly hack, but works for now until it's moved into the UI store
  (async () => {
    const htmlRoot = document.getElementsByTagName("html")[0];

    // Prevent infinite loop
    let loopCount = 0;
    while (loopCount++ < 100) {
      if (_window.nativeTheme.shouldUseHighContrastColors) {
        htmlRoot.classList.add("high-contrast");
      } else {
        htmlRoot.classList.remove("high-contrast");
      }

      if (false && _window.nativeTheme.shouldUseDarkColors) {
        // This will be used for future dark-theme
        htmlRoot.classList.add("dark");
        htmlRoot.classList.remove("light");
      } else {
        htmlRoot.classList.add("light");
        htmlRoot.classList.remove("dark");
      }

      // This will wait here until there is a change... maybe forever
      _window.nativeTheme = await _window.ScrowlApp.listenForThemeUpdate();

      _window.prefersReducedMotion = await _window.ScrowlApp.prefersReducedMotion();
    }
  })();

  if (rootEl) {
    ClientProxy.init();
    ReactDOM.createRoot(rootEl).render(<Provider store={store}>{<Editor />}</Provider>);
  } else {
    console.error("Error: Missing #root div");
    document.write("Error: Missing #root div");
  }
})();
