import express, { Express } from "express";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions.js";

import cookieParser from "cookie-parser";
const app: Express = express();

import { requestLogger } from "./middleware/requestLogger.js";
import { credentials } from "./middleware/credentials.js";
import { verifyJWT } from "./middleware/verifyJWT.js";

/* Routers */
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";
import registerRouter from "./controllers/register.js";
import refreshTokensRouter from "./controllers/refreshTokens.js";
import logoutRouter from "./controllers/logout.js";
import challengesRouter from "./controllers/challenges.js";
// const questionsRouter = require("./controllers/questions");
import playRouter from "./controllers/play.js";
import leaderboardsRouter from "./controllers/leaderboards.js";
import playDemoRouter from "./controllers/playDemo.js";

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
app.use(verifyJWT);
app.use("/api/users", usersRouter);
app.use("/api/challenges", challengesRouter);
// app.use("/api/questions", questionsRouter);
app.use("/api/play", playRouter);
app.use("/api/leaderboards", leaderboardsRouter);

export default app;
