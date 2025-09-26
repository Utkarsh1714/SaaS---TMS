import jwt from "jsonwebtoken";
import Message from "../models/MessageModel.js";

const initializeSocket = (io) => {
  // 🔑 This is our powerful authentication middleware
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie

    if (!cookieHeader) {
        console.error("Socket Auth Error: No cookie header provided.");
        // Stop the connection attempt immediately
        return next(new Error("Authentication Error: Cookie not provided."));
    }

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
        console.error("Socket Auth Error: 'token' cookie missing from header.");
        return next(new Error("Authentication Error: Token not provided."));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication Error: Invalid token.")); // SECURITY CHECK: Ensure the token has the necessary info

      if (!decoded.id || !decoded.organizationId)
        return next(
          new Error("Authentication Error: Token is missing required data.")
        ); // Attach user info to the socket object for later use

      socket.user = {
        id: decoded.id,
        role: decoded.role,
        organizationId: decoded.organizationId,
      };

      next(); // Grant connection
    });
  });

  io.on("connection", (socket) => {
    console.log(
      `✅ User connected: ${socket.user.id} from org: ${socket.user.organizationId}`
    ); // We MUST join the user to a room specific to their organization. // This is the key to isolating communication.

    socket.join(socket.user.organizationId); // 1. Logic for joining a specific chat room // The frontend will emit this event when user click on chat.

    socket.on("joinChat", (channelId) => {
      socket.join(channelId);
      console.log(`User ${socket.user.id} joined channel: ${channelId}`);
    }); // 2. Logic for sending and broadcasting the message.

    socket.on("sendMessage", async (data) => {
      // 🐛 Log event reception and data
      console.log(`📩 Received 'sendMessage' event.`);
      console.log("Message data:", data);

      const { channelId, content } = data;

      if (!channelId || !content) {
        console.error("Validation Error: channelId or content is missing.");
        return;
      }

      const newMessageData = {
        sender: socket.user.id,
        content: content,
        channel: channelId,
        organizationId: socket.user.organizationId,
      };

      try {
        // Step A: Save the message to the database
        let message = await Message.create(newMessageData); // Step B: Populate the sender's info before broadcasting

        message = await message.populate("sender", "username email"); // Step C: Broadcast the new message to everyone in the channel's room

        io.to(channelId).emit("newMessage", message);
        console.log("✅ Message sent successfully to channel:", channelId);
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user.id}`); // You can emit a status update here if you want
    });
  });
};

export default initializeSocket;
