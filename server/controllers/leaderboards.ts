import { PrismaClient } from "@prisma/client";
import { customRequest } from "../customTypings/customRequest";
import { Request, Response } from "express";

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

// Get highest streak
leaderboardsRouter.get(
  "/highest-streak",
  async (req: Request, res: Response) => {
    try {
      const highestStreak = await prisma.userAccount.findMany({
        orderBy: {
          challengeStreak: "desc",
        },
        take: 100,
      });

      res.status(200).json({ highestStreak });
    } catch (err) {
      console.log(err);
    }
  }
);

// Get highest total score for all time
leaderboardsRouter.get(
  "/total-score/all-time",
  async (req: Request, res: Response) => {
    try {
      // Prisma does not as of yet support lookup queries on groupBy, so need to use queryRaw

      const totalScoreAllTime =
        await prisma.$queryRaw`SELECT "UserAccount"."id",
    "UserAccount"."username",
    SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
FROM "UserAccount"
JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
WHERE "ChallengeSubmission"."isComplete" = TRUE
-- AND "Challenge"."startDate" >= NOW() - INTERVAL '1 month'
GROUP BY "UserAccount"."id", "UserAccount"."username"
ORDER BY "totalScoreSum" DESC
LIMIT 100;`;

      res.status(200).json({ totalScoreAllTime });
    } catch (err) {
      console.log(err);
    }
  }
);

// Get highest total score for the month
leaderboardsRouter.get(
  "/total-score/monthly",
  async (req: customRequest, res: Response) => {
    try {
      // Prisma does not as of yet support lookup queries on groupBy, so need to use queryRaw

      const totalScoreMonthly =
        await prisma.$queryRaw`SELECT "UserAccount"."id",
    "UserAccount"."username",
    SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
FROM "UserAccount"
JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
WHERE "ChallengeSubmission"."isComplete" = TRUE
AND "Challenge"."startDate" >= NOW() - INTERVAL '1 month'
GROUP BY "UserAccount"."id", "UserAccount"."username"
ORDER BY "totalScoreSum" DESC
LIMIT 100;`;

      res.status(200).json({ totalScoreMonthly });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = leaderboardsRouter;
