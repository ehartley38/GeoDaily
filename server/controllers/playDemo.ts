import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({});
const playDemoRouter = require("express").Router();

playDemoRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Get the first question of the current challenge
    const currentChallenge = await prisma.challenge.findFirst({
      where: {
        isActive: true,
      },
      include: {
        questions: {
          take: 1,
        },
      },
    });

    if (!currentChallenge) {
      return res.status(400).json({ msg: "No current challenge found" });
    }

    res.status(200).json({ currentChallenge });
  } catch (err) {
    console.log(err);
  }
});

module.exports = playDemoRouter;
