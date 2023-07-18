import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});
const playRouter = require("express").Router();

playRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    // Get the current challenge
    // TODO
    const currentChallenge = await prisma.challenge.findFirst({
      where: {
        id: "e86566c6-a510-48ae-bf62-84bafe5d839c",
      },
    });

    // Create a challenge submission
    let challengeSubmission = null;
    challengeSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
        playerId: req.user.id,
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

module.exports = playRouter;
