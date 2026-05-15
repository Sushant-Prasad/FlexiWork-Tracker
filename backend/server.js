import express from "express"; // Express app
import dotenv from "dotenv"; // Env loader
import { connectToDB } from "./utils/connectDB.js"; // Database connector
import authRouter from "./routes/authRouter.js"; // Auth routes
import teamRouter from "./routes/teamRouter.js"; // Team routes
import shiftPlanRoutes from "./routes/shiftPlanRoutes.js"; // Shift plan routes
import workLogRouter from "./routes/workLogRouter.js"; // Work log routes
import userRoutes from "./routes/userRoutes.js"; // User routes
import "./cron/nightlyWorkLogCheck.js"; // Register nightly cron
import attendanceRoutes from "./routes/attendanceRoutes.js"; // Attendance routes
import "./cron/attendanceSnapshot.js"; // Register attendance snapshot cron
import projectRoutes from "./routes/projectRoutes.js"; // Project routes
dotenv.config();


const app = express(); // Create express app
const PORT = process.env.PORT || 5000; // Port from env or default

app.use(express.json()); // Parse JSON bodies

// Auth APIs
app.use("/api/auth", authRouter);

// Team APIs
app.use("/api/teams", teamRouter);

// Shift plan APIs
app.use("/api/shiftplans", shiftPlanRoutes);

// Work log APIs
app.use("/api/worklogs", workLogRouter);

// User APIs
app.use("/api/users", userRoutes);

// Attendance APIs
app.use("/api/attendance", attendanceRoutes);

// Project APIs
app.use("/api/projects", projectRoutes);


// Start server
const startServer = async () => {
  try {
    await connectToDB();
    console.log("DB connected successfully!");

    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
  }
};

startServer();