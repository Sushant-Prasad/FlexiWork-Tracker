import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./utils/connectDB.js";
import authRouter from "./routes/authRouter.js";
import teamRouter from "./routes/teamRouter.js";
import shiftPlanRoutes from "./routes/shiftPlanRoutes.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Auth APIs
app.use("/api/auth", authRouter);

// Team APIs
app.use("/api/teams", teamRouter);

// Shift plan APIs
app.use("/api/shiftplans", shiftPlanRoutes);


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