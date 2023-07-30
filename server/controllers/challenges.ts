import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});
const challengesRouter = require("express").Router();

// Get the current challenge (Hard-code id for now)
challengesRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: "e86566c6-a510-48ae-bf62-84bafe5d839c",
      },
      include: {
        questions: true,
      },
    });

    res.status(200).json(challenge);
  } catch (err) {}
});

// Get a users challenge submission for current challenge (hard code ID for now)
challengesRouter.get(
  "/current-submission",
  async (req: customRequest, res: Response) => {
    try {
      const challengeSubmission = await prisma.challengeSubmission.findFirst({
        where: {
          parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
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

// Get a users submission history for all challenges
challengesRouter.get("/history", async (req: customRequest, res: Response) => {
  try {
    const submissionHistory = await prisma.challengeSubmission.findMany({
      where: {
        playerId: req.user.id,
      },
      include: {
        parentChallenge: true,
      },
    });

    res.status(200).json(submissionHistory);
  } catch (err) {
    console.log(err);
  }
});

// Get a users submission history for a specific challenge
challengesRouter.get(
  "/summary/:challengeId",
  async (req: customRequest, res: Response) => {
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
challengesRouter.post("/", async (req: customRequest, res: Response) => {
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
});

module.exports = challengesRouter;
