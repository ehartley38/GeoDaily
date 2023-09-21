import { Response, NextFunction, Request } from "express";
import { customRequest } from "../customTypings/customRequest";

export const verifyRoles = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // Ideally use customRequest instead of any
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
