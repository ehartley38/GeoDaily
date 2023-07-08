import express, { Express } from "express";
const config = require("./utils/config");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const app: Express = express();

/* Routers */
const usersRouter = require("./controllers/users");

app.use(middleware.credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(middleware.requestLogger);

/* Routes */
app.use("/api/users", usersRouter);

module.exports = app;
