import { Response, NextFunction, Request } from "express";
import { customRequest } from "../customTypings/customRequest";
import { decodedResult } from "../customTypings/decodedResult";
import { config } from "../utils/config.js";

import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const verifyJWT = (
  req: any, //Ideally, this would be of type customRequest. But I cannot get it to work in middleware :(
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!(authHeader as string)?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = (authHeader as string).split(" ")[1];
  // console.log(token);

  const accessTokenSecret = config.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return res.status(500).json({
      error: "Internal Server Error - ACCESS_TOKEN_SECRET not defined",
    });
  }

  jwt.verify(token, accessTokenSecret, async (err: any, decoded: any) => {
    // Ideally, decoded would be decodedResult type
    if (err) {
      console.error("Error inside");
      console.error(err);
      return res.status(403).json({ error: "Invalid token" });
    }

    try {
      const user = await prisma.userAccount.findUnique({
        where: {
          email: decoded.email,
        },
        include: {
          friends: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      req.email = decoded.email;
      req.roleList = decoded.roleList;
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
