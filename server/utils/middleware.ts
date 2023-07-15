import { Request, Response, NextFunction } from "express";
import { customRequest } from "../customTypings/customRequest";
import { decodedResult } from "../customTypings/decodedResult";

const logger = require("./logger");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Log details of each req to the console
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || req.headers.referer;

  if (config.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  // res.header("Access-Control-Allow-Credentials", true);

  next();
};

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
        });

        if (!user) {
          return res.status(403).json({ error: "user invalid" });
        }
        req.user = user;
        req.roleList = decoded.roleList;
      } catch (err) {
        console.log(err);
      }

      next();
    }
  );
};

const verifyRoles = (allowedRoles: string[]) => {
  return (req: customRequest, res: Response, next: NextFunction) => {
    if (!req?.roleList) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    let result = false;
    rolesArray.some((role) => {
      if (req.roleList.includes(role)) {
        result = true;
      }
    });

    if (!result) return res.sendStatus(401);

    next();
  };
};

module.exports = { requestLogger, credentials, verifyJWT, verifyRoles };
