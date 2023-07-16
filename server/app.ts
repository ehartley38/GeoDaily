import express, { Express } from "express";
import { requestLogger } from "./middleware/requestLogger";
import { credentials } from "./middleware/credentials";
const verifyJWT = require("./middleware/verifyJWT");
const cors = require("cors");
const corsOptions = require("./utils/corsOptions");
const cookieParser = require("cookie-parser");
const app: Express = express();

/* Routers */
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const registerRouter = require("./controllers/register");
const refreshTokensRouter = require("./controllers/refreshTokens");
const logoutRouter = require("./controllers/logout");

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

/* Protected routes */
app.use(verifyJWT.verifyJWT);
app.use("/api/users", usersRouter);

module.exports = app;
