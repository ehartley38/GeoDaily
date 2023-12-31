import { config } from "./config.js";

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (config.allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
