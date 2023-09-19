import { Response, NextFunction } from "express";
import { customRequest } from "../customTypings/customRequest";
import { decodedResult } from "../customTypings/decodedResult";
const jwt = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const verifyJWT = (req: customRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!(authHeader as string)?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = (authHeader as string).split(" ")[1];
  // console.log(token);

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err: any, decoded: decodedResult) => {
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
    }
  );
};

module.exports = { verifyJWT };
