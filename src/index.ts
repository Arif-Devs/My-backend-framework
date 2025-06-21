import { createServer, IncomingMessage, ServerResponse } from "node:http";
const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  const path = req.url;
  const method = req.method;

  console.log(`${method} ${path}`);

  const response = {
    statusCode: 200,
    path: path,
    method: method,
  };

  res.writeHead(200, { "Content-Type": "Application/json" });
  res.write(JSON.stringify(response));
  res.end();
};

const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
