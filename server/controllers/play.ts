import { Request, Response, Router } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";
import { haversine_distance } from "../utils/haversineDistance.ts";
import { verifyRoles } from "../middleware/verifyRoles.ts";

const prisma = new PrismaClient({});
const playRouter = Router();

playRouter.get("/", verifyRoles(["BASIC"]), async (req: any, res: Response) => {
  try {
    // Get the current challenge
    const currentChallenge = await prisma.challenge.findFirst({
      where: {
        isActive: true,
      },
      include: {
        questions: true,
      },
    });

    if (!currentChallenge) {
      return res.status(400).json({ msg: "No current challenge found" });
    }

    // Fetch or Create a challenge submission
    let challengeSubmission = null;
    challengeSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        parentChallengeId: currentChallenge!.id,
        playerId: req.user.id,
      },
      include: {
        questionsAnswered: true,
      },
    });

    if (!challengeSubmission) {
      challengeSubmission = await prisma.challengeSubmission.create({
        data: {
          playerId: req.user.id,
          parentChallengeId: currentChallenge!.id,
        },
      });
    }

    res.status(200).json({ currentChallenge, challengeSubmission });
  } catch (err) {
    console.log(err);
  }
});

// Get time until the next challenge is available
playRouter.get(
  "/time-remaining",
  verifyRoles(["BASIC"]),
  (req: Request, res: Response) => {
    const currentDate = new Date();

    // Set the time to midnight tonight
    const midnightTonight = new Date();
    midnightTonight.setHours(24, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for midnight

    // Calculate the time remaining in milliseconds
    const timeRemaining = midnightTonight.getTime() - currentDate.getTime();

    res.status(200).json({ timeRemaining });
  }
);

// Submit a question in a challenge
playRouter.post(
  "/submitQuestion",
  verifyRoles(["BASIC"]),
  async (req: any, res: Response) => {
    const body = req.body;
    let distance,
      score = 0;
    let isComplete = false;

    try {
      // Distance in meters
      distance = Math.round(
        haversine_distance(body.question.correctPos, body.markerPosition)
      );
      // Tidy up
      // Calculate the score for the question / 10,000 based on exponential decay
      const maxDistance = 3000000;
      if (distance <= maxDistance) {
        // const decayFactor = -Math.log(1 / 10000) / 5000000;
        // Calculate the decay factor using:
        // points_at_d_max = max_points * e^(-decay_rate * d_max)
        // And solve for decay_rate

        const decayFactor = 0.00000184;

        score = Math.round(10000 * Math.exp(-decayFactor * distance));
      }

      // Create a question submission
      const questionSubmission = await prisma.questionSubmission.create({
        data: {
          playerId: req.user.id,
          parentChallengeSubmissionId: body.challengeSubmission.id,
          parentQuestionId: body.question.id,
          attemptPos: body.markerPosition,
          score: score,
          distance: distance,
        },
      });

      // Check if this is the final question and update challenge submission accordingly
      // Get the number of questions the user has submitted for this challenge
      const userQuestionsCount = await prisma.questionSubmission.count({
        where: {
          playerId: req.user.id,
          parentChallengeSubmissionId: body.challengeSubmission.id,
        },
      });

      // Get the questions for this challenge
      const challenge = await prisma.challenge.findUnique({
        where: {
          id: body.challengeSubmission.parentChallengeId,
        },
        include: { questions: true },
      });

      // Compare
      isComplete = userQuestionsCount === challenge?.questions.length;

      if (isComplete) {
        // Get the scores for all question submissions
        const scores = await prisma.questionSubmission.findMany({
          where: {
            playerId: req.user.id,
            parentChallengeSubmissionId: body.challengeSubmission.id,
          },
          select: {
            score: true,
          },
        });

        let totalScore = 0;
        scores.map((submission) => {
          totalScore += submission.score;
        });

        // Update challengeSubmission isComplete and totalScore fields
        const updatedChallengeSubmission =
          await prisma.challengeSubmission.update({
            where: {
              id: body.challengeSubmission.id,
            },
            data: {
              isComplete: isComplete,
              totalScore: totalScore,
            },
          });

        // Update the user challengeStreak
        const updatedUser = await prisma.userAccount.update({
          where: {
            id: req.user.id,
          },
          data: {
            challengeStreak: {
              increment: 1,
            },
          },
        });
      }
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ distance, score, isComplete });
  }
);

export default playRouter;
