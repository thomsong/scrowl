import * as React from "react";
import HostContext from "./HostContext";

import TemplateHandler from "./TemplateHandler";

const defaultContext: any = {
  layoutState: null,
  slide: {
    templateName: "",
    templateVersion: "",
  },

  templateLoaded: false,
  mode: "edit",
  actions: {},
  focusElement: null,
};

function ContextWrapper(props: any) {
  const [contextValue, setContextValue] = React.useState(defaultContext as any);

  React.useEffect(() => {
    const onChange = (payload: any): Promise<any> => {
      const { fieldKey, value } = payload;

      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };

        const [fieldKeyPart1, fieldKeyPart2] = fieldKey.split(".");

        if (fieldKeyPart2) {
          if (!newContext.data[fieldKeyPart1]) {
            newContext.data[fieldKeyPart1] = {};
          }
          newContext.data[fieldKeyPart1][fieldKeyPart2] = value;
        } else {
          newContext.data[fieldKeyPart1] = value;
        }

        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const setLayoutState = (payload: any): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };
        newContext.layoutState = payload;
        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const setSlide = (payload: any): Promise<any> => {
      return new Promise<any>(async (resolve) => {
        setContextValue((contextValue: any) => {
          const newContext = { ...contextValue };

          newContext.slide = payload;

          // This is forces the wrapper to refresh. This prevents
          // poorly coded templates from keeping state on slide change
          newContext.templateLoaded = false;

          window.scrollTo(0, 0);

          return newContext;
        });

        resolve(true);
      });
    };

    const updateSlideContent = (payload: any): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };

        newContext.slide.content[payload.fieldKey] = payload.value;
        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const setSlideValidationErrors = (payload: any): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };
        newContext.slide.validationErrors = payload;

        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const setMode = (payload: any): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };

        newContext.mode = payload.mode;
        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const onFocus = (payload: any, props: any): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };
        newContext.focusElement = payload;
        return newContext;
      });

      if (props.focusRange) {
        const [minScroll, maxScroll] = props.focusRange;
        // Adjust window scroll to keep it in range
        if (window.scrollY < minScroll) {
          window.scrollTo({ left: 0, top: minScroll, behavior: "smooth" });
        } else if (window.scrollY > maxScroll) {
          window.scrollTo({ left: 0, top: maxScroll, behavior: "smooth" });
        }
      }

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    const onBlur = (): Promise<any> => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };
        newContext.focusElement = null;
        return newContext;
      });

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    };

    TemplateHandler.addHandler((event: string, payload: any): Promise<any> => {
      switch (event) {
        case "onChange":
          return onChange(payload);
        case "setMode":
          return setMode(payload);
        case "onBlur":
          return onBlur();
        case "onFocus":
          return onFocus(payload.fieldKey, payload.props);
        case "setLayoutState":
          return setLayoutState(payload);
        case "setSlide":
          return setSlide(payload);
        case "updateSlideContent":
          return updateSlideContent(payload);
        case "setSlideValidationErrors":
          return setSlideValidationErrors(payload);

        default:
          console.warn("Unhandled ContextWrapper.tsx::TemplateHandler", event);
      }

      return new Promise<any>((resolve) => {
        resolve(true);
      });
    });

    const setTemplateLoaded = () => {
      setContextValue((contextValue: any) => {
        const newContext = { ...contextValue };
        newContext.templateLoaded = true;
        return newContext;
      });
    };

    // Add actions that can be called
    setContextValue((contextValue: any) => {
      const newContext = { ...contextValue };
      newContext.actions = {
        setTemplateLoaded,
      };

      return newContext;
    });

    return () => {
      TemplateHandler.removeHandler();
    };
  }, []);

  return <HostContext.Provider value={contextValue}>{props.children}</HostContext.Provider>;
}

export default ContextWrapper;
