const logger = require("./logger");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Log details of each request to the console
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const credentials = (request, response, next) => {
  const origin = request.headers.origin || request.headers.referer;

  if (config.allowedOrigins.includes(origin)) {
    console.log("Origin allowed");
    response.header("Access-Control-Allow-Credentials", true);
  }
  // response.header("Access-Control-Allow-Credentials", true);

  next();
};

const verifyJWT = (request, response, next) => {
  const authHeader =
    request.headers.authorization || request.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return response.sendStatus(401);
  const token = authHeader.split(" ")[1];
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return response.sendStatus(403).json({ error: "Invalid token" }); //invalid token

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return response.status(403).json({ error: "user invalid" });
      }
      request.user = user;
    } catch (err) {
      console.log(err);
    }

    next();
  });
};

module.exports = { requestLogger, credentials, verifyJWT };
