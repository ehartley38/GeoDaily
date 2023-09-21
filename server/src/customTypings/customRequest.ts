import { Request } from "express-serve-static-core";

export interface customRequest extends Request {
  user: any; // Tidy up user object
  roleList: string[];
  email: string;
}
