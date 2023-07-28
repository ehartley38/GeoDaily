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
    } catch (err) {
      console.log(err);
    }

    res.status(200).json({ distance });
  }
);

module.exports = playRouter;
