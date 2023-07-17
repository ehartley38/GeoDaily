import { Request } from "express-serve-static-core";

export interface customRequest extends Request {
  user: any;
  roleList: string[];
  email: string;
}
