import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});
const playRouter = require("express").Router();

playRouter.post("/", async (req: customRequest, res: Response) => {
  try {
    // Create a challenge submission
    const chalSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
        playerId: req.user.id,
      },
    });

    if (!chalSubmission) {
      await prisma.challengeSubmission.create({
        data: {
          playerId: req.user.id,
          parentChallengeId: "e86566c6-a510-48ae-bf62-84bafe5d839c",
        },
      });
    }
    console.log(chalSubmission);
  } catch (err) {}
});

module.exports = playRouter;
