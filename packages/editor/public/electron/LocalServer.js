const nodeStatic = require("node-static");
const path = require("path");
const RequestMod = require("request");
const appVersion = require("../../package.json").version;

const isDev = process.env.ENVIRONMENT === "dev" ? true : false;

class LocalServer {
  courseFileResponder = null;
  serverInstance = null;

  constructor() {}

  start() {
    // This server is used for serving the app and previews/etc.
    // Better than serving from file:// for sandbox purposes
    let staticPath = path.resolve(`${__dirname}/../../build/`);
    if (isDev) {
      staticPath = path.resolve(`${__dirname}/../../public/`);
    }

    var staticFile = new nodeStatic.Server(staticPath, {
      cache: false,
    });

    console.log("Starting local server...");
    this.serverInstance = require("http")
      .createServer(async (request, response) => {
        if (request.headers["user-agent"] !== "scrowl") {
          response.writeHead(400);
          response.end();
          return;
        }

        // Route /course/ urls to the course folder in the user directory
        if (request.url.startsWith("/course/")) {
          request
            .addListener("end", () => {
              response.setHeader("Cache-Control", "no-cache");
              response.setHeader("Scrowl-Server", "v" + appVersion);
              response.setHeader("Access-Control-Allow-Origin", "null");

              if (!this.courseFileResponder) {
                response.writeHead(400);
                response.end();
                return;
              }

              let requestedURL = request.url.substring(7);
              request.path = request.url = requestedURL;

              // Helps with previewing a course - allows us to not copy the assets when previewing
              if (request.url.startsWith("/preview/player/course/assets/")) {
                requestedURL = request.url.substring(22);
                request.path = request.url = requestedURL;
              }

              this.courseFileResponder.serve(request, response);
            })
            .resume();

          return;
        }

        if (isDev) {
          // Proxy it to local dev server
          request.pipe(RequestMod("http://localhost:3000" + request.url)).pipe(response);
        } else {
          response.setHeader("Access-Control-Allow-Origin", "null");

          request
            .addListener("end", function () {
              response.setHeader("Cache-Control", "no-cache");
              response.setHeader("Scrowl-Server", "v" + appVersion);
              staticFile.serve(request, response);
            })
            .resume();
        }
      })
      .listen(14191);
  }

  setCourseFileResponder(responder) {
    this.courseFileResponder = responder;
  }

  close() {
    if (this.serverInstance) {
      this.serverInstance.close();
    }
  }
}

module.exports = new LocalServer();
