import { createApp } from "./framework";

const app = createApp();

app.on("request: received", () => {
  console.log("request received");
});

app.on("request: processed", () => {
  console.log("request processed");
});

app.listen(4000, () => {
  console.log("server listening on port 4000");
});
