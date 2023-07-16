import { Request, Response, NextFunction } from "express";
const config = require("../utils/config");

export const credentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin || req.headers.referer;

  if (config.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  // res.header("Access-Control-Allow-Credentials", true);

  next();
};
