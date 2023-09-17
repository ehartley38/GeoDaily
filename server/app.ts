import express, { Express } from "express";
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const cookieParser = require("cookie-parser");
const app: Express = express();

import { requestLogger } from "./middleware/requestLogger";
import { credentials } from "./middleware/credentials";
const verifyJWT = require("./middleware/verifyJWT");

/* Routers */
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const registerRouter = require("./controllers/register");
const refreshTokensRouter = require("./controllers/refreshTokens");
const logoutRouter = require("./controllers/logout");
const challengesRouter = require("./controllers/challenges");
// const questionsRouter = require("./controllers/questions");
const playRouter = require("./controllers/play");
const leaderboardsRouter = require("./controllers/leaderboards");
const playDemoRouter = require("./controllers/playDemo");

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());

/* Un-protected routes */
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/refreshTokens", refreshTokensRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/playDemo", playDemoRouter);

/* Protected routes */
app.use(verifyJWT.verifyJWT);
app.use("/api/users", usersRouter);
app.use("/api/challenges", challengesRouter);
// app.use("/api/questions", questionsRouter);
app.use("/api/play", playRouter);
app.use("/api/leaderboards", leaderboardsRouter);

module.exports = app;
