import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const logoutRouter = Router();

logoutRouter.get("/", async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await prisma.userAccount.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      console.log("No user to clearing cookies");
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204).end();
    }

    const updateUser = await prisma.userAccount.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: "",
      },
    });

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
  }
});

export default logoutRouter;
