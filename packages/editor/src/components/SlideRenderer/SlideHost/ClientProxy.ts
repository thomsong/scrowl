import MessageHandler from "./MessageHandler";

class ClientProxy {
  private channelPort: any = null;
  private hasWindowHandler = false;
  private connectedToClient = false;

  private promises: any = {};
  private callbackIndex = 1;

  private handlers: any = {};

  constructor() {
    this.init();
    this.loadHandlers();
  }

  loadHandlers = () => {
    this.handlers["template"] = new MessageHandler();
  };

  public init = () => {
    console.log("ClientProxy INIT");
    this.listen();
  };

  public closeConnection = () => {
    this.connectedToClient = false;
  };

  public waitUntilConnected = async () => {
    return new Promise((resolve, reject) => {
      let checkCount = 0;
      const intervalRef = setInterval(() => {
        if (checkCount++ >= 50) {
          clearInterval(intervalRef);
          reject(false);
          return;
        }
        if (this.connectedToClient) {
          clearInterval(intervalRef);
          resolve(true);
          return;
        }
      }, 50);
    });
  };

  private listen = () => {
    if (this.hasWindowHandler) {
      return;
    }

    console.log("ClientProxy::LISTENING....");
    (window as any).addEventListener("message", this.postMessageHandler, true);
    this.hasWindowHandler = true;
  };

  private postMessageHandler = (msg: any) => {
    // console.log("postMessageHandler", msg.data);
    if (msg.data === "host_proxy_init") {
      this.channelPort = msg.ports?.[0];

      if (!this.channelPort) {
        throw new Error("Channel port could not be found.");
      }

      this.channelPort.onmessage = (msg: any) => {
        // Handle the incoming msg
        this.handleMessageFromClient(msg.data);
      };

      this.handleSuccessfulConnection();
    }
  };

  private handleSuccessfulConnection = async () => {
    // console.log("handleSuccessfulConnection x1", this.connectedToClient);
    this.connectedToClient = true;
    this.channelPort.postMessage("host_connected");
  };

  private handleMessageFromClient = async (data: any) => {
    const action: any = data.action;
    const payload: any = data.payload;
    const callbackId: any = data.callbackId;

    // console.log("GOT MSG", data);
    if (!action) {
      console.error("Missing call action");
      return;
    }

    if (!payload) {
      console.error("Missing call payload");
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

      const resolve = promise[0];
      delete this.promises[callbackId];

      return resolve(payload);
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
    if (!this.connectedToClient) {
      console.error("Proxy not connected to client.", action, payload);
      throw new Error("Proxy not connected to client.");
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

  destroy = () => {
    if (this.hasWindowHandler) {
      (window as any).removeEventListener("message", this.postMessageHandler, true);
      this.hasWindowHandler = false;
    }
  };
}

const proxyInstance = new ClientProxy();
export default proxyInstance;
