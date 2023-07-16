import { Response, NextFunction } from "express";
import { customRequest } from "../customTypings/customRequest";

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

module.exports = { verifyRoles };
