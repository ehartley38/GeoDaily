import express, { Express } from "express";
const config = require("./utils/config");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const cookieParser = require("cookie-parser");
const app: Express = express();

/* Routers */
const usersRouter = require("./controllers/users");

app.use(middleware.credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(cookieParser());

/* Routes */
app.use("/api/users", usersRouter);

module.exports = app;
