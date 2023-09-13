import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { haversine_distance } from "../utils/haversineDistance";

const prisma = new PrismaClient({});
const playDemoRouter = require("express").Router();

playDemoRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Get the first question of the current challenge
    const currentChallenge = await prisma.challenge.findFirst({
      where: {
        isActive: true,
      },
      include: {
        questions: {
          take: 1,
        },
      },
    });

    if (!currentChallenge) {
      return res.status(400).json({ msg: "No current challenge found" });
    }

    res.status(200).json({ currentChallenge });
  } catch (err) {
    console.log(err);
  }
});

// Get temp submission data using submitted token
playDemoRouter.post("/temp-submission", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body.token);

  try {
    const tempSubmission = await prisma.tempQuestionSubmission.findFirst({
      where: {
        token: body.token,
      },
    });

    res.status(200).json({ tempSubmission });
  } catch (err) {
    console.log(err);
  }
});

// Submit the temp question
playDemoRouter.post(
  "/submitTempQuestion",
  async (req: Request, res: Response) => {
    const body = req.body;
    let distance,
      score = 0;

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

      // Create a temp question submission
      const createTempSubmission = await prisma.tempQuestionSubmission.create({
        data: {
          parentQuestionId: body.question.id,
          attemptPos: body.markerPosition,
          score: score,
          distance: distance,
        },
      });

      // Generate a token value for temp question submission by b64 encoding
      const token = btoa(createTempSubmission.id);

      const updatedTempSubmission = await prisma.tempQuestionSubmission.update({
        where: {
          id: createTempSubmission.id,
        },
        data: {
          token: token,
        },
      });

      res.status(200).json({ distance, score, token });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = playDemoRouter;
