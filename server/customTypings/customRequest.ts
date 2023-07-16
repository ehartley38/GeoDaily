import { Request } from "express-serve-static-core";

export interface customRequest extends Request {
  roleList: string[];
  email: string;
}
