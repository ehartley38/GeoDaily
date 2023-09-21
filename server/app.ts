import express, { Express } from "express";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions.ts";

import cookieParser from "cookie-parser";
const app: Express = express();

import { requestLogger } from "./middleware/requestLogger.ts";
import { credentials } from "./middleware/credentials.ts";
import { verifyJWT } from "./middleware/verifyJWT.ts";

/* Routers */
import usersRouter from "./controllers/users.ts";
import loginRouter from "./controllers/login.ts";
import registerRouter from "./controllers/register.ts";
import refreshTokensRouter from "./controllers/refreshTokens.ts";
import logoutRouter from "./controllers/logout.ts";
import challengesRouter from "./controllers/challenges.ts";
// const questionsRouter = require("./controllers/questions");
import playRouter from "./controllers/play.ts";
import leaderboardsRouter from "./controllers/leaderboards.ts";
import playDemoRouter from "./controllers/playDemo.ts";

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
