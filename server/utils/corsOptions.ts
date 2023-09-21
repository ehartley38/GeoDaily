import { config } from "../utils/config.ts";

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (config.allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
      console.log(origin);
    }
  },
  optionsSuccessStatus: 200,
};
