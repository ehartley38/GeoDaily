const { PrismaClient } = require("@prisma/client");

const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const prisma = new PrismaClient();

const refreshTokensRouter = require("express").Router();

refreshTokensRouter.get("/", async (request, response) => {
  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(401);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) return response.sendStatus(403);
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || user.email !== decoded.email) return response.sendStatus(404);
      const role = user.roles;
      const userForToken = {
        email: decoded.email,
        id: user.id,
      };
      const accessToken = jwt.sign(userForToken, config.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      response.status(200).json({ role, accessToken });
    });
  } catch (err) {}
});

module.exports = refreshTokensRouter;
