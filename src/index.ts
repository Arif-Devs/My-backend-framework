import { createServer } from "node:http";
const PORT = 4000;

const server = createServer();
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
