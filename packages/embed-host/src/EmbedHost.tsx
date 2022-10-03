import Scrowl from "./Scrowl";
import * as React from "react";
import HostContext from "./HostContext";

import TemplateCache from "./TemplateCache";

const _window: any = window as any;
const requirejs = _window.requirejs;

function EmbedHost() {
  const hostContext: any = React.useContext(HostContext);
  const currentTemplateKey = React.useRef("");
  const scrollMagicController: any = React.useRef(new _window.ScrollMagic.Controller());

  const { templateLoaded } = hostContext;
  const hostContextActions: any = hostContext.actions;

  React.useEffect(() => {
    const { templateName, templateVersion } = hostContext.slide;

    if (!templateName || !templateVersion) {
      return;
    }

    const templateKey = templateName + ":" + templateVersion;
    if (templateKey === currentTemplateKey.current) {
      // return;
    }

    const cacheResult = TemplateCache.get(templateName, templateVersion);

    if (cacheResult) {
      if (!templateLoaded) {
        hostContextActions.setTemplateLoaded({ templateName, templateVersion });
      }

      const notifyHostTemplateReady = async () => {
        const readyResult: any = await Scrowl.host.sendMessage("template.ready", hostContext.slide);
      };
      notifyHostTemplateReady().catch(console.error);

      return;
    }

    currentTemplateKey.current = templateKey;
    console.warn("Got a new templateName/templateVersion");

    const templatePath = "./assets/templates/" + templateName + "@" + templateVersion + "/index.js";

    requirejs([templatePath], function (template: any) {
      if (!template) {
        console.error("Error loading template: " + templateName + "@" + templateVersion);
        return;
      }

      TemplateCache.set(templateName, templateVersion, template);

      hostContextActions.setTemplateLoaded({ templateName, templateVersion });

      const notifyHostTemplateReady = async () => {
        const readyResult: any = await Scrowl.host.sendMessage("template.ready", hostContext.slide);
      };
      notifyHostTemplateReady().catch(console.error);
    });
  }, [hostContextActions, hostContext.slide, templateLoaded]);

  if (!templateLoaded) {
    return <div className="empty"></div>;
  }

  const { templateName, templateVersion } = hostContext.slide;
  const template = TemplateCache.get(templateName, templateVersion);
  const RenderComponent = template.render;

  const templateKey = (templateName + "@" + templateVersion).replace(/[\W_]+/g, "-");

  return (
    <div className="sld-host">
      {
        <RenderComponent
          templateKey={templateKey}
          id={"SLIDE-ID" + hostContext.slide.id}
          editMode={true}
          slide={hostContext.slide}
          content={hostContext.content}
          validationErrors={hostContext.validationErrors}
          focusElement={hostContext.focusElement}
          controller={scrollMagicController.current}
        />
      }
    </div>
  );
}

export default EmbedHost;
