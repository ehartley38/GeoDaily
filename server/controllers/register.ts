import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const registerRouter = require("express").Router();
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

registerRouter.post("/", async (req: Request, res: Response) => {
  const { email, username, password, confirmPassword } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing registration details" });
  }

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        passwordHash: passwordHash,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Email or Username not unique" });
      }
      return res.status(500).json({ message: "User registration failed" });
    }
  }
});

module.exports = registerRouter;
