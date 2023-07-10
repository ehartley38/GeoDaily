const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const logoutRouter = require("express").Router();

logoutRouter.get("/", async (request, response) => {
  const cookies = request.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      console.log("No user to clearing cookies");
      response.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return response.sendStatus(204).end();
    }

    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: "",
      },
    });

    response.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    response.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

module.exports = logoutRouter;
