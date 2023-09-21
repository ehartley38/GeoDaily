// const app = require("./app");
import app from "./app.ts";

import { config } from "./utils/config.ts";
import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
