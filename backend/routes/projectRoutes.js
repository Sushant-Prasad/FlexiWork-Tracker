import express from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import roleMiddleware from "../middleware/roleMiddleware.js"; // Role checks
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";

/*
Project Routes
Purpose
- Create, list, update, and delete projects.
*/

const projectRoutes = express.Router(); // Router for project endpoints

// Shared id param validator
const projectIdParam = [param("id").isMongoId().withMessage("Project id must be valid")];

// Create project validators
const createValidators = [
  body("title").isString().trim().isLength({ min: 2 }).withMessage("title is required"),
  body("description").optional().isString(),
  body("assignedTeam").optional().isMongoId().withMessage("assignedTeam must be valid"),
  body("startDate").optional().isString(),
  body("deadline").optional().isString(),
  body("status")
    .optional()
    .isIn(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"])
    .withMessage("status is invalid"),
];

// Update project validators
const updateValidators = [
  body("title").optional().isString().trim().isLength({ min: 2 }),
  body("description").optional().isString(),
  body("assignedTeam").optional().isMongoId(),
  body("startDate").optional().isString(),
  body("deadline").optional().isString(),
  body("status").optional().isIn(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"]),
];

// POST /api/projects - create project (MANAGER, SYSTEM_ADMIN)
projectRoutes.post(
  "/",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Only managers/admins can create
  createValidators, // Validate payload
  validateMiddleware, // Return 400 on validation errors
  createProject // Create project
);

// GET /api/projects - list projects
projectRoutes.get(
  "/",
  authMiddleware, // Require authenticated user
  getProjects // Fetch projects
);

// PATCH /api/projects/:id - update project (MANAGER, SYSTEM_ADMIN)
projectRoutes.patch(
  "/:id",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Only managers/admins can update
  projectIdParam, // Validate project id
  updateValidators, // Validate update payload
  validateMiddleware, // Return 400 on validation errors
  updateProject // Update project
);

// DELETE /api/projects/:id - delete project (MANAGER, SYSTEM_ADMIN)
projectRoutes.delete(
  "/:id",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Only managers/admins can delete
  projectIdParam, // Validate project id
  validateMiddleware, // Return 400 on validation errors
  deleteProject // Delete project
);

export default projectRoutes;
