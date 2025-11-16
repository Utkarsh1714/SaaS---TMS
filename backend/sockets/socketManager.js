import jwt from "jsonwebtoken";
import Message from "../models/MessageModel.js";
import Channel from "../models/channelModel.js";

const initializeSocket = (io) => {
  // 🔑 This is our powerful authentication middleware
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

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
      if (err) {
        // 🚨 ADD THIS LINE TO SEE THE JWT ERROR REASON (e.g., 'TokenExpiredError')
        console.error("JWT Verification Error:", err.name, err.message);
        return next(new Error("Authentication Error: Invalid token."));
      }

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
    console.log(`✅ User connected: ${socket.user.id}`);
    socket.join(socket.user.organizationId); // 1. Logic for joining a specific chat room // The frontend will emit this event when user click on chat.
    console.log(
      `🏠 User ${socket.user.id} auto-joined org room: ${socket.user.organizationId}`
    );
    // socket.on("joinOrgRoom", (organizationId) => {
    //   // We log to ensure the client is communicating properly
    //   console.log(
    //     `🏠 Client ${socket.user.id} explicitly joined status room: ${organizationId}`
    //   );

    //   // Safety: Ensure the client is joining the correct room ID (which should match the JWT one)
    //   socket.join(organizationId);
    // });

    socket.on("joinChat", async (channelId) => {
      try {
        // <-- CHANGED: ADDED SECURITY CHECK
        // Verify the user is actually a participant in this channel
        const channel = await Channel.findOne({
          _id: channelId,
          participants: { $elemMatch: { $eq: socket.user.id } },
          organizationId: socket.user.organizationId, // Double-check it's in their org
        });

        if (!channel) {
          console.warn(
            `SECURITY: User ${socket.user.id} denied from joining channel ${channelId}`
          );
          return; // Stop execution
        }
        // <-- END SECURITY CHECK

        socket.join(channelId);
        console.log(`User ${socket.user.id} joined channel: ${channelId}`);
      } catch (error) {
        console.error(`Error joining channel ${channelId}:`, error.message);
      }
    }); // 2. Logic for sending and broadcasting the message.

    socket.on("sendMessage", async (data) => {
      const { channelId, content } = data;

      if (!channelId || !content) {
        console.error("Validation Error: channelId or content is missing.");
        return;
      }

      try {
        // Verify the user is a participant before letting them send a message
        const channel = await Channel.findOne({
          _id: channelId,
          participants: { $elemMatch: { $eq: socket.user.id } },
        });

        if (!channel) {
          console.warn(
            `SECURITY: User ${socket.user.id} tried to send to un-joined channel ${channelId}`
          );
          return; // Stop execution
        }
        // <-- END SECURITY CHECK

        // User is authorized, now create the message
        const newMessageData = {
          sender: socket.user.id,
          content: content,
          channel: channelId,
          organizationId: socket.user.organizationId,
        };

        // Step A: Save the message to the database
        let message = await Message.create(newMessageData);
        
        // Step B: Populate the sender's info
        message = await message.populate("sender", "username email contactNo");
        
        // Step C: Broadcast the new message to everyone in the channel's room
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
