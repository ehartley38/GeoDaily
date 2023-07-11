const { PrismaClient } = require("@prisma/client");
import { Response } from "express";
import { customRequest } from "../customTypings/customRequest";

const prisma = new PrismaClient();
const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

usersRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users).end();
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get("/data", async (req: customRequest, res: Response) => {
  const user = req.user;
  const id = user.id;

  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json(userData).end();
  } catch (err) {
    res.status(400).end();
  }
});

module.exports = usersRouter;
