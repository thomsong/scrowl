import TemplateHandler from "./TemplateHandler";

class HostProxy {
  private connectedToHost = false;
  private channelPort: any = null;

  private promises: any = {};
  private callbackIndex = 1;

  private handlers: any = {};

  constructor() {
    this.connect();
  }

  loadHandlers = () => {
    // console.log("Load handlers");
    this.handlers["template"] = TemplateHandler;
  };

  private connect = () => {
    // console.log("HostProxy::connect called");
    const channel = new MessageChannel();
    this.channelPort = channel.port1;
    //   console.log("iFrame loaded");

    this.channelPort.onmessage = (msg: any) => {
      // console.log("this.channelPort.onmessage", msg);
      if (msg.data === "host_connected") {
        this.handleSuccessfulConnection();
        return;
      }

      if (!this.connectedToHost) {
        // Received data without first being connected. Should never happen
        throw new Error("Proxy not connected to host. Should not receive data yet");
      }

      // Handle the incoming msg
      this.handleMessageFromHost(msg.data);
    };

    // console.log("host_proxy_init SENT");
    window.parent.postMessage("host_proxy_init", "*", [channel.port2]);
  };

  private handleSuccessfulConnection = () => {
    // console.log("handleSuccessfulConnection x2", this.connectedToHost);
    this.connectedToHost = true;

    this.loadHandlers();
  };

  private handleMessageFromHost = async (data: any) => {
    const action: any = data.action;
    const payload: any = data.payload;
    const callbackId: any = data.callbackId;

    // console.log("EMbed::Incoming msg", action, payload);
    if (!action) {
      console.error("Missing call action");
      return;
    }

    if (!payload) {
      console.error("Missing call payload", data);
      return;
    }

    const actionParts = action.split(".");
    if (action !== "callback" && actionParts.length !== 2) {
      console.error("Malform message action. Should have two parts: " + action);
      return;
    }

    const handlerType: any = actionParts[0];
    const handlerAction: any = actionParts[1];

    if (handlerType === "callback") {
      if (!callbackId) {
        console.error("Callback is missing callbackId");
        return;
      }

      const promise = this.promises[callbackId];
      if (!promise) {
        console.error("Callback is missing a valid promise", callbackId);
        return;
      }

      const [resolve, reject] = promise;
      delete this.promises[callbackId];

      resolve(payload);
      return;
    }

    const handler = this.handlers[handlerType];

    if (!handler) {
      console.error("Unhandled message type from client proxy: " + handlerType);
      return;
    }

    const handlerResponse = await handler.handleMsg(handlerAction, payload);

    this.sendMessage("callback", handlerResponse, callbackId);
  };

  public sendMessage = async (action: string, payload: any, _callbackId?: number): Promise<any> => {
    if (!this.connectedToHost) {
      console.log("Proxy not connected to host", action, payload, _callbackId);
      throw new Error("Proxy not connected to host.");
    }

    const callbackId: number = _callbackId ? _callbackId : this.callbackIndex++;

    const messagePayload: any = {
      action,
      payload: typeof payload === "string" ? payload : { ...payload }, // We need to clone payload since a ref is passed
      callbackId,
    };

    this.channelPort.postMessage(messagePayload);

    // Only add it to the queue if we are not returning a response
    if (!_callbackId) {
      const promise = new Promise<any>((resolve, reject) => {
        this.promises[callbackId] = [resolve, reject];
      });

      return promise;
    }

    return null;
  };

  setUser = async (name: string): Promise<any> => {
    return await this.sendMessage("user.debug", { name });
  };
}

export default HostProxy;
