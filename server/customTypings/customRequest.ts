import { Request } from "express";

export interface customRequest extends Request {
  roleList: string[];
  email: string;
}
