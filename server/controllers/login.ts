import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const config = require("../utils/config");
const prisma = new PrismaClient();

loginRouter.post("/", async (req: Request, res: Response) => {
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
      email: user.email,
      id: user.id,
    };

    const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { email: user.email },
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

module.exports = loginRouter;