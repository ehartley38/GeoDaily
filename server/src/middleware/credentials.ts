import { Request, Response, NextFunction } from "express";
import { config } from "../utils/config.js";

export const credentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin: any = req.headers.origin || req.headers.referer;

  if (config.allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  // res.header("Access-Control-Allow-Credentials", true);

  next();
};
