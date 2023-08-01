const { PrismaClient } = require("@prisma/client");
import { Response } from "express";
import { customRequest } from "../customTypings/customRequest";
const prisma = new PrismaClient();
const usersRouter = require("express").Router();
const verifyRoles = require("../middleware/verifyRoles");

usersRouter.get("/", async (req: customRequest, res: Response) => {
  try {
    const users = await prisma.userAccount.findMany();
    res.status(200).json(users).end();
  } catch (err) {
    console.log(err);
  }
});

usersRouter.get(
  "/data",
  verifyRoles.verifyRoles(["BASIC"]),
  async (req: customRequest, res: Response) => {
    try {
      const userData = await prisma.userAccount.findUnique({
        where: {
          email: req.email,
        },
        include: {
          friends: true,
        },
      });
      res.status(200).json(userData).end();
    } catch (err) {
      res.status(400).end();
    }
  }
);

// Get all a users incoming friend requests
usersRouter.get(
  "/get-friend-requests",
  async (req: customRequest, res: Response) => {
    try {
      const friendRequests = await prisma.friendRequest.findMany({
        where: {
          receiverUsername: req.user.username,
        },
      });
      res.status(200).json(friendRequests);
    } catch (err) {
      console.log(err);
    }
  }
);

// Send a friend request
usersRouter.post(
  "/send-friend-request",
  async (req: customRequest, res: Response) => {
    const body = req.body;
    const user = req.user;

    try {
      // Check if friend is already added

      // Check if user is trying to add themselves
      if (user.username === body.receiverUsername) {
        return res
          .status(400)
          .json({ msg: "You cannot add yourself as a friend!" })
          .end();
      }
      // Check if username exists in DB
      const recipient = await prisma.userAccount.findUnique({
        where: {
          username: body.receiverUsername,
        },
      });

      if (!recipient) {
        return res
          .status(404)
          .json({
            msg: `No user exists with username: ${body.receiverUsername}`,
          })
          .end();
      }

      // Check if friend request is already sent
      const requestCount = await prisma.friendRequest.count({
        where: {
          senderUsername: user.username,
          receiverUsername: body.receiverUsername,
        },
      });

      if (requestCount >= 1) {
        return res
          .status(400)
          .json({
            msg: `Friend request to user ${body.receiverUsername} already sent`,
          })
          .end();
      }

      // Send friend request
      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderUsername: user.username,
          receiverUsername: body.receiverUsername,
        },
      });
      return res.status(201).json({ msg: "Friend request sent" }).end();
    } catch (err) {
      console.log(err);
    }
  }
);

usersRouter.post(
  "/accept-friend-request",
  async (req: customRequest, res: Response) => {
    const body = req.body;
    const user = req.user;

    try {
      // Get the sender user ID from the senderUsername
      const sender = await prisma.userAccount.findUnique({
        where: {
          username: body.senderUsername,
        },
      });

      // Update the sender and receivers friend list
      const updatedReceiver = await prisma.userAccount.update({
        where: {
          id: user.id,
        },
        data: {
          friends: {
            connect: {
              id: sender.id,
            },
          },
        },
      });

      const updatedSender = await prisma.userAccount.update({
        where: {
          id: sender.id,
        },
        data: {
          friends: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // Delete the friend request
      const deleteRequest = await prisma.friendRequest.delete({
        where: {
          id: body.requestId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = usersRouter;
