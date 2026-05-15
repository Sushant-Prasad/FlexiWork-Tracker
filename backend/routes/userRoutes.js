import express from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  getProfile,
  getTeamMembers,
  updateProfile,
} from "../controllers/userController.js";

/*
User Routes
Purpose
- Profile, updates, and team member listing.
*/

const userRoutes = express.Router(); // Router for user endpoints

// Validate update payload fields
const updateValidators = [
  body("name").optional().isString().trim().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
  body("avatarUrl").optional().isString(),
  body("timezone").optional().isString(),
  body("settings").optional().isObject(),
  body("settings.geoCheckOptIn").optional().isBoolean(),
  body("settings.editCutoffHour").optional().isInt({ min: 0, max: 23 }),
];

// GET /api/users/me - fetch profile
userRoutes.get(
  "/me",
  authMiddleware, // Require authenticated user
  getProfile // Fetch logged-in profile
);

// PATCH /api/users/update - update profile fields
userRoutes.patch(
  "/update",
  authMiddleware, // Require authenticated user
  updateValidators, // Validate update payload
  validateMiddleware, // Return 400 on validation errors
  updateProfile // Apply profile updates
);

// GET /api/users/team - fetch members in same team
userRoutes.get(
  "/team",
  authMiddleware, // Require authenticated user
  getTeamMembers // Return team members
);

export default userRoutes;
