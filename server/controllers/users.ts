const { PrismaClient } = require("@prisma/client");
import { Response } from "express";
import { customRequest } from "../customTypings/customRequest";
const prisma = new PrismaClient();
const usersRouter = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");

usersRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    const users = await prisma.userAccount.findMany();
    res.status(200).json(users).end();
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get(
  "/data",
  verifyRoles.verifyRoles(["BASIC"]),
  async (req: customRequest, res: Response) => {
    try {
      const userData = await prisma.userAccount.findUnique({
        where: {
          email: req.email,
        },
      });
      res.status(200).json(userData).end();
    } catch (err) {
      res.status(400).end();
    }
  }
);

module.exports = usersRouter;
