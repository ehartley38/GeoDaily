import { PrismaClient } from "@prisma/client";
import { customRequest } from "../customTypings/customRequest";
import { Response } from "express";

const prisma = new PrismaClient({});
const leaderboardsRouter = require("express").Router();

// Get top daily scores
leaderboardsRouter.get(
  "/top-daily",
  async (req: customRequest, res: Response) => {
    try {
      // Get current daily challenge
      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      // Get top 100
      const topDaily = await prisma.challengeSubmission.findMany({
        where: {
          parentChallengeId: currentChallenge!.id,
          isComplete: true,
        },

        take: 100,
        orderBy: {
          totalScore: "desc",
        },
        include: {
          player: {
            select: {
              username: true,
            },
          },
        },
      });

      const testData = [];
      for (let i = 0; i < 50; i++) {
        testData.push(...topDaily);
      }

      //   res.status(200).json({ topDaily });
      res.status(200).json({ testData });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = leaderboardsRouter;
