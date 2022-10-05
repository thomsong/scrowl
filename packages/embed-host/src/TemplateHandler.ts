import TemplateCache from "./TemplateCache";

class TemplateHandler {
  private handlerCallback: Function | null = null;

  public handleMsg(handlerAction: string, payload: any): Promise<any> {
    switch (handlerAction) {
      case "setMode":
        return this.setMode(payload);
      case "getContentLayout":
        return this.getContentLayout(payload);
      case "onChange":
        return this.onChange(payload);
      case "onValidate":
        return this.onValidate(payload);
      case "onFocus":
        return this.onFocus(payload);
      case "onBlur":
        return this.onBlur(payload);
      case "setLayoutState":
        return this.setLayoutState(payload);
      case "setSlide":
        return this.setSlide(payload);
      case "updateSlideContent":
        return this.updateSlideContent(payload);
      case "setSlideValidationErrors":
        return this.setSlideValidationErrors(payload);

      default:
        console.error("Unhandled Embed::TemplateHandler::" + handlerAction, payload);
    }

    return new Promise<any>((_, reject) => {
      reject({ error: "Unhandled Embed::TemplateHandler::" + handlerAction });
    });
  }

  private setMode(payload: any): Promise<any> {
    return this.dispatchToHandler("setMode", payload);
  }

  private getContentLayout(payload: any): Promise<any> {
    const currentTemplate = TemplateCache.get(payload.templateName, payload.templateVersion);

    return new Promise<any>((resolve) => {
      resolve(currentTemplate.content.getLayout(payload));
    });
  }

  private onChange(payload: any): Promise<any> {
    return this.dispatchToHandler("onChange", payload);
  }

  private onValidate(payload: any): Promise<any> {
    const template = TemplateCache.get(payload.slide.templateName, payload.slide.templateVersion);

    const validationResult = template.content.validate(payload);
    return new Promise<any>((resolve) => {
      resolve(validationResult);
    });
  }

  private onFocus(payload: any): Promise<any> {
    return this.dispatchToHandler("onFocus", payload);
  }

  private onBlur(payload: any): Promise<any> {
    return this.dispatchToHandler("onBlur", payload);
  }

  private setLayoutState(payload: any): Promise<any> {
    return this.dispatchToHandler("setLayoutState", payload);
  }

  private setSlide(payload: any): Promise<any> {
    return this.dispatchToHandler("setSlide", payload);
  }

  private updateSlideContent(payload: any): Promise<any> {
    return this.dispatchToHandler("updateSlideContent", payload);
  }

  private setSlideValidationErrors(payload: any): Promise<any> {
    return this.dispatchToHandler("setSlideValidationErrors", payload);
  }

  public dispatchToHandler(event: string, payload: any): Promise<any> {
    if (!this.handlerCallback) {
      return new Promise<any>((resolve) => {
        resolve(true);
      });
    }

    return this.handlerCallback(event, payload);
  }

  public addHandler(callback: Function) {
    if (typeof callback != "function") {
      return;
    }

    this.handlerCallback = callback;
  }

  public removeHandler() {
    this.handlerCallback = null;
  }
}

const instance = new TemplateHandler();
export default instance;
