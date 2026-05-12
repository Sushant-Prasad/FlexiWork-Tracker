import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
// Register a new user with name, email, password, and role
router.post("/register", registerUser);

// POST /api/auth/login
// Login user with email and password
router.post("/login", loginUser);

// GET /api/auth/me
// Get current authenticated user (requires valid JWT)
router.get("/me", authMiddleware, getCurrentUser);

export default router;
