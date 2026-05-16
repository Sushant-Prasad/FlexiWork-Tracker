import express from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import roleMiddleware from "../middleware/roleMiddleware.js"; // Role checks
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  approveLeave,
  createLeaveRequest,
  getMyLeaves,
  getPendingLeaves,
  rejectLeave,
} from "../controllers/leaveController.js";

/*
Leave Routes
Purpose
- Apply, review, approve, and reject leave requests.
*/

const leaveRoutes = express.Router(); // Router for leave endpoints

// Validators for creating leave requests
const createValidators = [
  body("type").isIn(["PTO", "SICK", "WFH"]).withMessage("type is invalid"),
  body("startDate").isString().notEmpty().withMessage("startDate is required"),
  body("endDate").isString().notEmpty().withMessage("endDate is required"),
  body("reason").optional().isString(),
];

// Validators for id param
const idParam = [param("id").isMongoId().withMessage("Leave id must be valid")];

// POST /api/leaves - employee applies for leave
leaveRoutes.post(
  "/",
  authMiddleware, // Require authenticated user
  createValidators, // Validate payload
  validateMiddleware, // Return 400 on validation errors
  createLeaveRequest // Create leave request
);

// GET /api/leaves/me - employee leave history
leaveRoutes.get(
  "/me",
  authMiddleware, // Require authenticated user
  getMyLeaves // Fetch own leaves
);

// GET /api/leaves/pending - pending approvals
leaveRoutes.get(
  "/pending",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Managers/admins only
  getPendingLeaves // Fetch pending leaves
);

// PATCH /api/leaves/:id/approve - approve leave
leaveRoutes.patch(
  "/:id/approve",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Managers/admins only
  idParam, // Validate id
  validateMiddleware, // Return 400 on validation errors
  approveLeave // Approve leave
);

// PATCH /api/leaves/:id/reject - reject leave
leaveRoutes.patch(
  "/:id/reject",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Managers/admins only
  idParam, // Validate id
  validateMiddleware, // Return 400 on validation errors
  rejectLeave // Reject leave
);

export default leaveRoutes;
