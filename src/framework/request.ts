import { IncomingMessage } from "node:http";
import { Method, Request } from "./Types";
import { parse } from "node:url";
export class RequestImpl implements Request {
  nodeReq: IncomingMessage;
  method: Method;
  headers: Record<string, string>;
  path: string;
  originalPath: string = "";
  query: Record<string, string>;
  params: Record<string, string> = {};
  body: string | object | null = null;

  constructor(nodeReq: IncomingMessage) {
    this.nodeReq = nodeReq;
    this.method = nodeReq.method as Method;
    this.headers = nodeReq.headers as Record<string, string>;

    const parsedUrl = parse(nodeReq.url!, true);
    this.path = parsedUrl.pathname!;
    this.query = parsedUrl.query as Record<string, string>;
  }

  async parseBody() {
    const allowMethods = ["POST", "PUT", "PATCH"];
    if (!allowMethods.includes(this.method)) {
      this.body = null;
      return;
    }

    const contentType = this.headers["content-type"]?.toLocaleLowerCase();
    if (!contentType) {
      this.body = null;
      return;
    }

    // read body as a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of this.nodeReq) {
      chunk.push(chunk);
    }

    const buffer = Buffer.concat(chunks).toString();

    if (contentType.includes("application/json")) {
      try {
        this.body = JSON.parse(buffer);
      } catch {
        this.body = null;
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try {
        const urlEncodedData = new URLSearchParams(buffer);
        this.body = Object.fromEntries(urlEncodedData.entries());
      } catch {
        this.body = null;
      }
    } else if (contentType.includes("multipart/form-data")) {
      this.body = null;
    } else if (contentType.includes("text/plain")) {
      this.body = buffer;
    } else {
      this.body = null;
    }
  }
}
