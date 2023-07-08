import express, { Express } from "express";

const app: Express = express();

/* Routers */
const usersRouter = require("./controllers/users");

/* Routes */
app.use("/api/users", usersRouter);

module.exports = app;
