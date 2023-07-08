import { PrismaClient, Prisma, Role } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const usersRouter = require("express").Router();
const jwt = require("jsonwebtoken");
import bcrypt from "bcrypt";
const config = require("../utils/config");

usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users).end();
  } catch (err) {
    console.log(err);
  }
});

usersRouter.post("/register", async (req: Request, res: Response) => {
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

usersRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ message: "invalid username or password" });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        message: "invalid username or password",
      });
    }

    const role = user.roles;

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { username: user.username },
      config.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const updateUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({ role, accessToken });
  } catch (err) {}
});

module.exports = usersRouter;
