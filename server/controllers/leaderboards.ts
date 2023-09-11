import { PrismaClient } from "@prisma/client";
import { customRequest } from "../customTypings/customRequest";
import { Request, Response } from "express";

const prisma = new PrismaClient({});
const leaderboardsRouter = require("express").Router();

// Get top daily scores
leaderboardsRouter.post(
  "/top-daily",
  async (req: customRequest, res: Response) => {
    const isFriendScope = req.body.friendScope;
    const user = req.user;
    let friendIds;

    try {
      // Get current daily challenge
      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      // If filtering by friends, gather all the friend ID's
      if (isFriendScope) {
        friendIds = user.friends.map((friend: any) => friend.id);
      }

      // Get top 100
      const topDaily = await prisma.challengeSubmission.findMany({
        where: {
          ...(isFriendScope
            ? {
                parentChallengeId: currentChallenge!.id,
                isComplete: true,
                OR: [{ playerId: { in: friendIds } }, { playerId: user.id }],
              }
            : { parentChallengeId: currentChallenge!.id, isComplete: true }),
        },

        take: 100,
        orderBy: {
          totalScore: "desc",
        },
        select: {
          playerId: true,
          totalScore: true,
          player: {
            select: {
              username: true,
            },
          },
        },
      });

      // const testData = [];
      // for (let i = 0; i < 50; i++) {
      //   testData.push(...topDaily);
      // }

      res.status(200).json({ topDaily });
      // res.status(200).json({ testData });
    } catch (err) {
      console.log(err);
    }
  }
);

// Get highest streak
leaderboardsRouter.post(
  "/highest-streak",
  async (req: customRequest, res: Response) => {
    const isFriendScope = req.body.friendScope;
    const user = req.user;
    let friendIds;

    try {
      // If filtering by friends, gather all the friend ID's
      if (isFriendScope) {
        friendIds = user.friends.map((friend: any) => friend.id);
      }

      const highestStreak = await prisma.userAccount.findMany({
        select: {
          id: true,
          username: true,
          challengeStreak: true,
        },
        where: {
          ...(isFriendScope
            ? {
                OR: [{ id: { in: friendIds } }, { id: user.id }],
              }
            : {}),
        },
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
leaderboardsRouter.post(
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
leaderboardsRouter.post(
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
