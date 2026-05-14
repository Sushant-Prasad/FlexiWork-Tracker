import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// POST /api/auth/register
// Register a new user with name, email, password, and role
authRouter.post("/register", registerUser);

// POST /api/auth/login
// Login user with email and password
authRouter.post("/login", loginUser);

// GET /api/auth/me
// Get current authenticated user (requires valid JWT)
authRouter.get("/me", authMiddleware, getCurrentUser);

export default authRouter;
