// 1. Force Node.js to use public DNS to resolve the MongoDB Atlas SRV record
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// 2. Your standard imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";

dotenv.config();

// Initialize app
const app = express();

// Connect database
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));

// Main API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/exchange", exchangeRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("LinkWiz Backend API is running");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});