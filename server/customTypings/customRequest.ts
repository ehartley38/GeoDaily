import { Request } from "express";

export interface customRequest extends Request {
  roleList: string[];
  user: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    refreshToken: string;
    roleList: string[];
  };
}
