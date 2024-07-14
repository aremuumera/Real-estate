

import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Fetch chats where the user is one of the participants
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // For each chat, find the receiver's information
    const chatsWithReceivers = await Promise.all(
      chats.map(async (chat) => {
        // Find the user that is not the current tokenUserId
        const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

        if (receiverId) {
          // Fetch the receiver's details from the database
          const receiver = await prisma.user.findUnique({
            where: {
              id: receiverId,  // Make sure id is not undefined
            },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });

          return {
            ...chat,
            receiver: receiver || { id: null, username: "Unknown", avatar: null },
          };
        } else {
          return {
            ...chat,
            receiver: { id: null, username: "Unknown", avatar: null }, // Default value
          };
        }
      })
    );

    res.status(200).json(chatsWithReceivers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

  export const getChat = async (req, res) => {
    const tokenUserId = req.userId;
  
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: req.params.id,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
  
      await prisma.chat.update({
        where: {
          id: req.params.id,
        },
        data: {
          seenBy: {
            push: [tokenUserId],
          },
        },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get chat!" });
    }
  };
  
  export const addChat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const newChat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, req.body.receiverId],
        },
      });
      res.status(200).json(newChat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add chat!" });
    }
  };
  
  export const readChat = async (req, res) => {
    const tokenUserId = req.userId;
  
    
    try {
      const chat = await prisma.chat.update({
        where: {
          id: req.params.id,
          userIDs: {
            hasSome: [tokenUserId],
          },
        },
        data: {
          seenBy: {
            set: [tokenUserId],
          },
        },
      });
      res.status(200).json(chat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to read chat!" });
    }
  };
  