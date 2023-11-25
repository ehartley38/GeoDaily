import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { verifyRoles } from "../middleware/verifyRoles.js";

const prisma = new PrismaClient({});
const leaderboardsRouter = Router();

// Get top daily scores
leaderboardsRouter.post(
  "/top-daily",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
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
                totalScore: {
                  gt: 0,
                },
              }
            : {
                parentChallengeId: currentChallenge!.id,
                isComplete: true,
                totalScore: {
                  gt: 0,
                },
              }),
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
              profilePicture: true,
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
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
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
          profilePicture: true,
        },
        where: {
          ...(isFriendScope
            ? {
                OR: [{ id: { in: friendIds } }, { id: user.id }],
                challengeStreak: {
                  gt: 0,
                },
              }
            : {
                challengeStreak: {
                  gt: 0,
                },
              }),
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
// Prisma does not as of yet support lookup queries on groupBy, so need to use queryRaw
leaderboardsRouter.post(
  "/total-score/all-time",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    const isFriendScope = req.body.friendScope;
    const user = req.user;
    let friendIds;
    let sqlQuery;

    try {
      // If filtering by friends (isFriendScope === true)
      if (isFriendScope) {
        friendIds = user.friends.map((friend: any) => friend.id);
        friendIds.push(user.id);

        sqlQuery = prisma.$queryRaw`
          SELECT "UserAccount"."id",
                 "UserAccount"."username",
                 "UserAccount"."profilePicture",
                 SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
          FROM "UserAccount"
          JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
          JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
          WHERE "ChallengeSubmission"."isComplete" = TRUE
          AND "UserAccount"."id" = ANY(${friendIds})
          GROUP BY "UserAccount"."id", "UserAccount"."username"
          HAVING SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) > 0
          ORDER BY "totalScoreSum" DESC
          LIMIT 100;
        `;
      } else {
        sqlQuery = prisma.$queryRaw`SELECT "UserAccount"."id",
        "UserAccount"."username",
        "UserAccount"."profilePicture",
        SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
    FROM "UserAccount"
    JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
    JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
    WHERE "ChallengeSubmission"."isComplete" = TRUE
    GROUP BY "UserAccount"."id", "UserAccount"."username"
    HAVING SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) > 0
    ORDER BY "totalScoreSum" DESC
    LIMIT 100;`;
      }

      const totalScoreAllTime = await sqlQuery;

      res.status(200).json({ totalScoreAllTime });
    } catch (err) {
      console.log(err);
    }
  }
);

// Get highest total score for the month
// Prisma does not as of yet support lookup queries on groupBy, so need to use queryRaw
leaderboardsRouter.post(
  "/total-score/monthly",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    const isFriendScope = req.body.friendScope;
    const user = req.user;
    let friendIds;
    let sqlQuery;
    try {
      // If filtering by friends
      if (isFriendScope) {
        friendIds = user.friends.map((friend: any) => friend.id);
        friendIds.push(user.id);

        sqlQuery = prisma.$queryRaw`
          SELECT "UserAccount"."id",
                 "UserAccount"."username",
                 "UserAccount"."profilePicture",
                 SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
          FROM "UserAccount"
          JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
          JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
          WHERE "ChallengeSubmission"."isComplete" = TRUE
          AND "UserAccount"."id" = ANY(${friendIds})
          AND "Challenge"."startDate" >= NOW() - INTERVAL '1 month'
          GROUP BY "UserAccount"."id", "UserAccount"."username"
          HAVING SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) > 0
          ORDER BY "totalScoreSum" DESC
          LIMIT 100;
        `;
      } else {
        sqlQuery = prisma.$queryRaw`SELECT "UserAccount"."id",
        "UserAccount"."username",
        "UserAccount"."profilePicture",
        SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) AS "totalScoreSum"
    FROM "UserAccount"
    JOIN "ChallengeSubmission" ON "UserAccount"."id" = "ChallengeSubmission"."playerId"
    JOIN "Challenge" ON "ChallengeSubmission"."parentChallengeId" = "Challenge"."id"
    WHERE "ChallengeSubmission"."isComplete" = TRUE
    AND "Challenge"."startDate" >= NOW() - INTERVAL '1 month'
    GROUP BY "UserAccount"."id", "UserAccount"."username"
    HAVING SUM(CAST("ChallengeSubmission"."totalScore" AS BIGINT)) > 0
    ORDER BY "totalScoreSum" DESC
    LIMIT 100;`;
      }

      const totalScoreMonthly = await sqlQuery;

      res.status(200).json({ totalScoreMonthly });
    } catch (err) {
      console.log(err);
    }
  }
);

export default leaderboardsRouter;
