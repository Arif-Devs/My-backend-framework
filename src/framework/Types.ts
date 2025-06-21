import { IncomingMessage, ServerResponse } from "node:http";

export type Method = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

export interface Request {
  path: string;
  originalPath: string;
  query: Record<string, string>;
  params: Record<string, string>;
  body: string | object | null;
}

export interface Response {
  nodeRes: ServerResponse;
  statusCode: number;
  headers: Record<string, string>;
  status(code: number): this;
  setHeader(key: string, value: string): this;
  send(body?: string | object | Buffer | null): this;
  json(body: object): this;
}

export type Handler = (req: Request, res: Response) => void | Promise<void>;
