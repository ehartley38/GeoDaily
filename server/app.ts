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
const loginRouter = require("./controllers/login");
const registerRouter = require("./controllers/register");
const refreshTokensRouter = require("./controllers/refreshTokens");
const logoutRouter = require("./controllers/logout");

app.use(middleware.credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(cookieParser());

/* Un-protected routes */
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/refreshTokens", refreshTokensRouter);
app.use("/api/logout", logoutRouter);

/* Protected routes */
app.use(middleware.verifyJWT);
app.use("/api/users", usersRouter);
// Route here
// And here
// etc

module.exports = app;
