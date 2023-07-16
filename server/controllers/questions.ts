import { Request, Response } from "express";
import { customRequest } from "../customTypings/customRequest";

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});
const questionsRouter = require("express").Router();

// Create a new question
questionsRouter.post("/", async (req: customRequest, res: Response) => {
  const body = req.body;

  const questionData = [
    {
      lat: body.lat,
      lng: body.lng,
    },
  ] as Prisma.JsonArray;

  try {
    const question = await prisma.question.create({
      data: {
        correctPos: questionData,
        parentChallenge: {
          connect: {
            id: "e86566c6-a510-48ae-bf62-84bafe5d839c",
          },
        },
      },
    });
    res.status(201).json(question);
  } catch (err) {
    console.log(err);
    console.log("ERROR");
  }
});

// Delete a question
// TODO delete associated question submission
questionsRouter.delete("/:id", async (req: customRequest, res: Response) => {
  const questionId = req.params.id;

  try {
    const question = await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    res.status(204).json(question);
  } catch (err) {
    console.log(err);
  }
});

module.exports = questionsRouter;
