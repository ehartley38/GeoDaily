import { Request, Response, Router } from "express";
import { decodedResult } from "../customTypings/decodedResult";
import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { config } from "../utils/config.js";
const prisma = new PrismaClient();

const refreshTokensRouter = Router();

refreshTokensRouter.get("/", async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = config.REFRESH_TOKEN_SECRET;
  if (!accessTokenSecret || !refreshTokenSecret) {
    return res.status(500).json({
      error: "Internal Server Error - Secret's not defined",
    });
  }

  try {
    const user = await prisma.userAccount.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET!,
      (err: any, decoded: any) => {
        // Ideally, use type decodedResult instead of any
        if (err || user.email !== decoded.email) return res.sendStatus(404);
        const roleList = user.roleList;
        const userForToken = {
          email: decoded.email,
          roleList: roleList,
        };
        const accessToken = jwt.sign(
          userForToken,
          config.ACCESS_TOKEN_SECRET!,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).json({ roleList, accessToken });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

export default refreshTokensRouter;
