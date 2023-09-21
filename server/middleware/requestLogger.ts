import { Request, Response, NextFunction } from "express";
import { info, error } from "../utils/logger.ts";

// Log details of each req to the console
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  info("Method:", req.method);
  info("Path:  ", req.path);
  info("Body:  ", req.body);
  info("---");
  next();
};
