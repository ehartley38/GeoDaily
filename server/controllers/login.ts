import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const loginRouter = Router();
import { config } from "../utils/config.ts";

const prisma = new PrismaClient();

loginRouter.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ message: "Invalid username or password" });

  const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = config.REFRESH_TOKEN_SECRET;
  if (!accessTokenSecret || !refreshTokenSecret) {
    return res.status(500).json({
      error: "Internal Server Error - Secret's not defined",
    });
  }

  try {
    const user = await prisma.userAccount.findUnique({
      where: {
        email: email,
      },
    });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const roleList = user.roleList;

    const userForToken = {
      email: user.email,
      roleList: roleList,
    };

    const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      { email: user.email },
      config.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const updateUser = await prisma.userAccount.update({
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

    res.status(200).send({ roleList, accessToken });
  } catch (err) {
    console.log(err);
  }
});

export default loginRouter;
