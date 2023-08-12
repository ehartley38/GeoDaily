import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";
import { getValidStreetView } from "../utils/getValidStreetView";

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

// Get a users challenge submission for current challenge
challengesRouter.get(
  "/current-submission",
  async (req: customRequest, res: Response) => {
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

// Create a new daily challenge
challengesRouter.post(
  "/create-daily",
  async (req: customRequest, res: Response) => {
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

      res.status(201).json(challenge);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

module.exports = challengesRouter;
