import { store } from "../../../store";
import { actions as courseActions } from "../../../store/slices/course";

class MessageHandler {
  public handleMsg(handlerAction: string, payload: any): Promise<any> {
    switch (handlerAction) {
      case "ready":
        return this.ready(payload);
      case "setContentPanelFocus":
        return this.setContentPanelFocus(payload);
      default:
        console.error("Unhandled TemplateHandler::" + handlerAction, payload);
    }

    return new Promise<any>((resolve, reject) => {
      reject({ error: "Unhandled TemplateHandler::" + handlerAction });
    });
  }

  private ready(payload: any): Promise<any> {
    store.dispatch(courseActions.setTemplateLoaded(payload));

    return new Promise<any>((resolve, reject) => {
      resolve(true);
    });
  }

  private setContentPanelFocus(payload: any): Promise<any> {
    store.dispatch(courseActions.setContentPanelFocus(payload));

    return new Promise<any>((resolve, reject) => {
      resolve(true);
    });
  }
}

export default MessageHandler;
