const app = require("./app");
const config = require("./utils/config");
import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
