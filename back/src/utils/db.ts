import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("🟢 MongoDB connected");
  } catch (err) {
    console.error("🔴 MongoDB connection error:", err);
    throw err;
  }
};
