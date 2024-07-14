import prisma from "../lib/prisma.js";

// Controller function to add a message to a chat
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId; // Get the user ID from the token
  const chatId = req.params.chatId; // Get the chat ID from the request parameters
  const text = req.body.text; // Get the message text from the request body

  try {
    // Find the chat to ensure the user is a participant
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId], // Check if the user is part of the chat
        },
      },
    });

    // If chat is not found, return a 404 error
    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Create a new message in the chat
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId, // Set the user ID as the sender
      },
    });

    // Update the chat to mark the message as seen and set the last message text
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId], // Update seenBy with the current user ID
        lastMessage: text, // Set the last message text
      },
    });

    // Respond with the created message
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" }); // Handle errors
  }
};
