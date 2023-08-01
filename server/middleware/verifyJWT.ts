import { Response, NextFunction } from "express";
import { customRequest } from "../customTypings/customRequest";
import { decodedResult } from "../customTypings/decodedResult";
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const verifyJWT = (req: customRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!(authHeader as string)?.startsWith("Bearer "))
    return res.sendStatus(401);
  const token = (authHeader as string).split(" ")[1];
  // console.log(token);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, decoded: decodedResult) => {
      if (err) return res.sendStatus(403).json({ error: "Invalid token" }); //invalid token

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
      } catch (err) {
        console.log(err);
      }

      next();
    }
  );
};

module.exports = { verifyJWT };
