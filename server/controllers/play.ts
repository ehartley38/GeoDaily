import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";
import { haversine_distance } from "../utils/haversineDistance";

const prisma = new PrismaClient({});
const playRouter = require("express").Router();

playRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    // Get the current challenge
    // TODO
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

// Submit a question in a challenge
playRouter.post(
  "/submitQuestion",
  async (req: customRequest, res: Response) => {
    const body = req.body;
    let distance,
      score = 0;
    let isComplete = false;

    try {
      // Distance in meters
      distance = Math.round(
        haversine_distance(body.question.correctPos, body.markerPosition)
      );

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
      }
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ distance, score, isComplete });
  }
);

module.exports = playRouter;
