import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { EventEmitter } from "node:stream";
import { RequestImpl } from "./request";

export class Server extends EventEmitter {
  private server: ReturnType<typeof createServer>;

  constructor() {
    super();
    this.server = createServer(this.handleRequest.bind(this));
  }

  private async handleRequest(
    nodeReq: IncomingMessage,
    nodeRes: ServerResponse
  ) {
    this.emit("request: received");
    const request = new RequestImpl(nodeReq);
    await request.parseBody();

    const response = {
      statusCode: 200,
      message: "hello->",
    };

    nodeRes.writeHead(200, { "Content-Type": "Application/json" });
    nodeRes.write(JSON.stringify(response));
    nodeRes.end();

    this.emit("request:processed");
  }

  listen(port: number, cb?: () => void) {
    this.server.listen(port, cb);
  }
}

new Server();
