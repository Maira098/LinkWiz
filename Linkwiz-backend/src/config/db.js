import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // Clean and simple connection without the outdated options
   const conn = await mongoose.connect(process.env.MONGO_URI, {
  family: 4,
  serverSelectionTimeoutMS: 30000,
});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // exit if DB fails
  }
};

export default connectDB;