import { Request, Response } from "express";
import { decodedResult } from "../customTypings/decodedResult";
const { PrismaClient } = require("@prisma/client");

const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const prisma = new PrismaClient();

const refreshTokensRouter = require("express").Router();

refreshTokensRouter.get("/", async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET,
      (err: any, decoded: decodedResult) => {
        if (err || user.email !== decoded.email) return res.sendStatus(404);
        const role = user.roles;
        const userForToken = {
          email: decoded.email,
          id: user.id,
        };
        const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).json({ role, accessToken });
      }
    );
  } catch (err) {}
});

module.exports = refreshTokensRouter;
