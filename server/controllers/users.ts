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
          friends: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      res.status(200).json(userData).end();
    } catch (err) {
      console.log(err);

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
      // Check for blank username
      if (!body.receiverUsername || body.receiverUsername.trim() === "") {
        return res.status(400).json({ msg: "Please enter a valid username" });
      }

      // Check if friend is already added
      const isAlreadyFriends = user.friends.find(
        (user: any) => user.username === body.receiverUsername
      );
      if (isAlreadyFriends) {
        return res.status(400).json({
          msg: `You are already friends with the user: ${user.username}`,
        });
      }

      // Check if user is trying to add themselves
      if (user.username === body.receiverUsername) {
        return res
          .status(400)
          .json({ msg: "You cannot add yourself as a friend!" });
      }
      // Check if username exists in DB
      const recipient = await prisma.userAccount.findUnique({
        where: {
          username: body.receiverUsername,
        },
      });

      if (!recipient) {
        return res.status(404).json({
          msg: `No user exists with username: ${body.receiverUsername}`,
        });
      }

      // Check if friend request is already sent
      const requestCount = await prisma.friendRequest.count({
        where: {
          senderUsername: user.username,
          receiverUsername: body.receiverUsername,
        },
      });

      if (requestCount >= 1) {
        return res.status(400).json({
          msg: `Friend request to user ${body.receiverUsername} already sent`,
        });
      }

      // Check if recepient has already sent a friend request
      const checkAlreadySent = await prisma.friendRequest.findFirst({
        where: {
          senderUsername: body.receiverUsername,
          receiverUsername: user.username,
        },
      });
      if (checkAlreadySent) {
        return res.status(400).json({
          msg: `User: ${body.receiverUsername} has already sent you a request! Check your friend requests.`,
        });
      }

      // Send friend request
      const friendRequest = await prisma.friendRequest.create({
        data: {
          senderUsername: user.username,
          receiverUsername: body.receiverUsername,
        },
      });
      return res.status(201).json({ msg: "Friend request sent" });
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

      return res.status(200).json({
        msg: "Friend request accepted",
        senderId: sender.id,
        senderUsername: sender.username,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

usersRouter.post(
  "/reject-friend-request",
  async (req: customRequest, res: Response) => {
    const body = req.body;

    try {
      // Delete the friend request
      const deleteRequest = await prisma.friendRequest.delete({
        where: {
          id: body.requestId,
        },
      });

      return res.status(200).json({ msg: "Friend request rejected" });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = usersRouter;
