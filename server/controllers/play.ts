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

    const distance = Math.round(
      haversine_distance(body.correctPos, body.markerPosition)
    ); // Distance in meters

    res.status(200).json({ distance });
  }
);
// https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api

module.exports = playRouter;
