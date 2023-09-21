import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response, Router } from "express";

import bcrypt from "bcrypt";

const prisma = new PrismaClient({});
const registerRouter = Router();

registerRouter.post("/", async (req: Request, res: Response) => {
  const { email, username, password, confirmPassword, demoToken } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing registration details" });
  }

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Generate random number between 1 and 14 (14 is the number of profile pictures available)
  const randomProfilePictureNum = Math.floor(Math.random() * 15);

  try {
    // Create the user
    const user = await prisma.userAccount.create({
      data: {
        email: email,
        username: username,
        passwordHash: passwordHash,
        roleList: ["BASIC"],
        profilePicture: randomProfilePictureNum,
      },
    });

    // Create the permanent submission if user has come from play-demo (i.e. if demoToken !== null)
    if (demoToken) {
      const tempSubmission = await prisma.tempQuestionSubmission.findFirst({
        where: {
          token: demoToken,
        },
      });

      const currentChallenge = await prisma.challenge.findFirst({
        where: {
          isActive: true,
        },
      });

      const createChalSubmission = await prisma.challengeSubmission.create({
        data: {
          playerId: user.id,
          parentChallengeId: currentChallenge!.id,
        },
      });

      if (tempSubmission) {
        const createQuestionSubmission = await prisma.questionSubmission.create(
          {
            data: {
              playerId: user.id,
              parentChallengeSubmissionId: createChalSubmission!.id,
              parentQuestionId: tempSubmission.parentQuestionId,
              attemptPos: tempSubmission.attemptPos!,
              score: tempSubmission.score,
              distance: tempSubmission.distance,
            },
          }
        );
        console.log("Question submission is", createQuestionSubmission);
      }
    }

    return res.status(201).json(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Email or Username not unique" });
      }
      return res.status(500).json({ message: "User registration failed" });
    }
    console.log(err);
  }
});

export default registerRouter;
