import { Request } from "express";

export interface customRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    refreshToken: string;
    roles: string;
  };
}
