import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./utils/connectDB.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


// Start server
const startServer = async () => {
  try {
    await connectToDB();
    console.log("✅ DB connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();