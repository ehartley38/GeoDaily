import { Request, Response, NextFunction } from "express";
const logger = require("../utils/logger");

// Log details of each req to the console
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};
