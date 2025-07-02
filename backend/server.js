import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./db/connectdb.js";

import authRoutes from "./routes/auth.route.js";
import employeeRoute from "./routes/employee.route.js";
import departmentRoute from "./routes/department.route.js";
import taskRouter from './routes/task.route.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("✅ New socket connected:", socket.id);

  socket.on("joinOrgRoom", (orgId) => {
    socket.join(orgId);
    console.log(`📡 Joined org room: ${orgId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// Import routes
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoute);
app.use("/api/department", departmentRoute);
app.use("/api/task", taskRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error: ", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
