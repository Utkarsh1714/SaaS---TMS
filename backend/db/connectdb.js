import mongoose from "mongoose";
import dotenv from "dotenv";
import { startCronJobs } from "../services/cronJobs.js";
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not found in environment variables.");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
    startCronJobs();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;