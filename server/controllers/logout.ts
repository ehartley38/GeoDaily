import { Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const logoutRouter = require("express").Router();

logoutRouter.get("/", async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      console.log("No user to clearing cookies");
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204).end();
    }

    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: "",
      },
    });

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

module.exports = logoutRouter;
