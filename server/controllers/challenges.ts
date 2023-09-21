import { Request, Response, Router } from "express";
import { customRequest } from "../customTypings/customRequest";
import { PrismaClient } from "@prisma/client";
import { getValidStreetView } from "../utils/getValidStreetView.ts";
import { verifyRoles } from "../middleware/verifyRoles.ts";

const prisma = new PrismaClient({});
const challengesRouter = Router();

// Get a users challenge submission for current challenge
challengesRouter.get(
  "/current-submission",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    try {
      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      if (!currentChallenge) {
        return res.status(400).json({ msg: "No current challenge found" });
      }

      const challengeSubmission = await prisma.challengeSubmission.findFirst({
        where: {
          parentChallengeId: currentChallenge.id,
          playerId: req.user.id,
        },
        include: {
          questionsAnswered: true,
        },
      });

      res.status(200).json(challengeSubmission);
    } catch (err) {
      console.log(err);
    }
  }
);

// Check if a user has completed the current challenge (return isComplete)
challengesRouter.get(
  "/current-submission/isComplete",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    try {
      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      if (!currentChallenge) {
        return res.status(400).json({ msg: "No current challenge found" });
      }

      const challengeSubmission = await prisma.challengeSubmission.findFirst({
        where: {
          parentChallengeId: currentChallenge.id,
          playerId: req.user.id,
        },
      });

      if (!challengeSubmission) {
        return res.status(200).json(false);
      }

      return res.status(200).json(challengeSubmission?.isComplete);
    } catch (err) {
      console.log(err);
    }
  }
);

// Get a users submission history for all challenges
challengesRouter.get(
  "/history",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    try {
      // I cant seem to work out how to order by a nested property...
      const submissionHistory = await prisma.challengeSubmission.findMany({
        where: {
          playerId: req.user.id,
          isComplete: true,
        },
        include: {
          parentChallenge: true,
        },
      });
      return res.status(200).json(submissionHistory.reverse());
    } catch (err) {
      console.log(err);
    }
  }
);

// Get a users submission history for a specific challenge
challengesRouter.get(
  "/summary/:challengeId",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    const challengeId = req.params.challengeId;
    try {
      const challengeSubmission = await prisma.challengeSubmission.findFirst({
        where: {
          parentChallengeId: challengeId,
          playerId: req.user.id,
        },
        include: {
          questionsAnswered: true,
        },
      });

      const challenge = await prisma.challenge.findFirst({
        where: {
          id: challengeId,
        },
        include: {
          questions: true,
        },
      });

      res.status(200).json({ challengeSubmission, challenge });
    } catch (err) {
      console.log(err);
    }
  }
);

// Create a new challenge
challengesRouter.post(
  "/",
  verifyRoles(["ADMIN"]),
  async (req: any, res: Response) => {
    const body = req.body;

    const challengeData = {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };

    try {
      const challenge = await prisma.challenge.create({
        data: challengeData,
      });

      res.status(201).json(challenge);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

// Create a new daily challenge
challengesRouter.post(
  "/create-daily",
  verifyRoles(["ADMIN"]),
  async (req: any, res: Response) => {
    const challengeData = {
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600 * 1000 * 24),
      isActive: true,
      questions: {
        create: [
          { correctPos: await getValidStreetView() },
          { correctPos: await getValidStreetView() },
          { correctPos: await getValidStreetView() },
        ],
      },
    };

    try {
      // First, handle any users challengeStreak reset
      // Get current challenge
      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      // Retrieve all users with no submissions for the current challenge
      const usersWithoutSubmissions = await prisma.userAccount.findMany({
        where: {
          NOT: {
            challengeSubmissions: {
              some: {
                parentChallengeId: currentChallenge?.id,
                isComplete: true,
              },
            },
          },
        },
      });

      // Update the challengeStreak to 0 for each relevant user
      const updatePromises = usersWithoutSubmissions.map((user) => {
        return prisma.userAccount.update({
          where: {
            id: user.id,
          },
          data: {
            challengeStreak: 0,
          },
        });
      });

      await Promise.all(updatePromises);

      // Now, handle the creation of the challenge
      // Set curret challenge isActive to false
      const updateCurrentChallenge = await prisma.challenge.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Create new challenge
      const challenge = await prisma.challenge.create({
        data: challengeData,
      });

      // Finally, delete all temp question submissions
      const deleteTempSubmissions =
        await prisma.tempQuestionSubmission.deleteMany({});

      res.status(201).json(challenge);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

export default challengesRouter;
