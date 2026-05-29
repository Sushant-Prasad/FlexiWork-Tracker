import express from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import roleMiddleware from "../middleware/roleMiddleware.js"; // Role checks
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  createTask,
  deleteTask,
  getTaskActivity,
  getTaskAnalytics,
  getTaskById,
  getMyTasks,
  getProjectTasks,
  updateTask,
} from "../controllers/taskController.js";

/*
Task Routes
Purpose
- Create, list, update, and delete tasks.
*/

const taskRoutes = express.Router(); // Router for task endpoints

// Validators for creating tasks
const createValidators = [
  body("projectId").isMongoId().withMessage("projectId must be valid"),
  body("title").isString().trim().isLength({ min: 2 }).withMessage("title is required"),
  body("description").optional().isString(),
  body("assignedTo").isMongoId().withMessage("assignedTo must be valid"),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
  body("effortHrs").optional().isNumeric(),
  body("dueDate").optional().isString(),
];

// Validators for update payload
const updateValidators = [
  param("id").isMongoId().withMessage("Task id must be valid"),
  body("status")
    .optional()
    .isIn([
      "TODO",
      "IN_PROGRESS",
      "READY_FOR_REVIEW",
      "TESTING",
      "DONE",
      "CHANGES_REQUESTED",
    ]),
  body("notes").optional().isString(),
  body("priority").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
  body("assignedTo").optional().isMongoId(),
  body("effortHrs").optional().isNumeric(),
  body("dueDate").optional().isString(),
];

const taskIdValidator = [
  param("id").isMongoId().withMessage("Task id must be valid"),
];

// POST /api/tasks - manager creates task
taskRoutes.post(
  "/",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Only managers/admins can create
  createValidators, // Validate payload
  validateMiddleware, // Return 400 on validation errors
  createTask // Create task
);

// GET /api/tasks/me - employee sees own tasks
taskRoutes.get(
  "/me",
  authMiddleware, // Require authenticated user
  getMyTasks // Fetch assigned tasks
);

// GET /api/tasks/analytics - employee task analytics
taskRoutes.get(
  "/analytics",
  authMiddleware, // Require authenticated user
  roleMiddleware("EMPLOYEE"),
  getTaskAnalytics
);

// GET /api/tasks/activity - employee recent activity
taskRoutes.get(
  "/activity",
  authMiddleware, // Require authenticated user
  roleMiddleware("EMPLOYEE"),
  getTaskActivity
);

// GET /api/tasks/project/:projectId - project tasks
taskRoutes.get(
  "/project/:projectId",
  authMiddleware, // Require authenticated user
  getProjectTasks // Fetch project tasks
);

// PATCH /api/tasks/:id - update task
taskRoutes.patch(
  "/:id",
  authMiddleware, // Require authenticated user
  updateValidators, // Validate update payload
  validateMiddleware, // Return 400 on validation errors
  updateTask // Update task
);

// GET /api/tasks/:id - task details
taskRoutes.get(
  "/:id",
  authMiddleware, // Require authenticated user
  taskIdValidator,
  validateMiddleware,
  getTaskById
);

// DELETE /api/tasks/:id - delete task
taskRoutes.delete(
  "/:id",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Only managers/admins can delete
  taskIdValidator,
  validateMiddleware, // Return 400 on validation errors
  deleteTask // Delete task
);

export default taskRoutes;
