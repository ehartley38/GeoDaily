const config = require("./config");

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (config.allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
      console.log(origin);
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
