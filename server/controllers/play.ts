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
    const currentChallenge = await prisma.challenge.findUnique({
      where: {
        id: "e86566c6-a510-48ae-bf62-84bafe5d839c",
      },
      include: {
        questions: true,
      },
    });

    // Create a challenge submission
    let challengeSubmission = null;
    challengeSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
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
          parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
        },
      });
    }

    res.status(200).json({ currentChallenge, challengeSubmission });
  } catch (err) {
    console.log(err);
  }
});

playRouter.post(
  "/submitQuestion",
  async (req: customRequest, res: Response) => {
    const body = req.body;
    let distance;
    let isComplete = false;

    try {
      distance = Math.round(
        haversine_distance(body.question.correctPos[0], body.markerPosition)
      ); // Distance in meters

      // Create a question submission
      const questionSubmission = await prisma.questionSubmission.create({
        data: {
          playerId: req.user.id,
          parentChallengeSubmissionId: body.challengeSubmission.id,
          parentQuestionId: body.question.id,
          attemptPos: body.markerPosition,
          score: distance,
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
        // Update challengeSubmission isComplete field
        const updatedChallengeSubmission =
          await prisma.challengeSubmission.update({
            where: {
              id: body.challengeSubmission.id,
            },
            data: {
              isComplete: isComplete,
            },
          });
      }
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ distance, isComplete });
  }
);

module.exports = playRouter;
