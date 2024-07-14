import { Server } from "socket.io";

// Initialize Socket.IO server
const io = new Server({
  cors: {
    origin: "https://real-estate-three-orcin.vercel.app",  // Allow connections from this origin
    credentials:true,            
    optionSuccessStatus:200
  },
});

// Array to store online users with their userId and socketId
let onlineUser = [];

// Function to add a user to onlineUser array
const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

// Function to remove a user from onlineUser array
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

// Function to get user details by userId
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

// Handle socket connection event
io.on("connection", (socket) => {
  // Event when a new user connects
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);  // Add user to online users list
  });

  // Event when a user sends a message
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);  // Find receiver's socket details
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);  // Send message to receiver
    }
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    removeUser(socket.id);  // Remove user from online users list
  });
});

// Start listening on port 4000
io.listen("4000");
