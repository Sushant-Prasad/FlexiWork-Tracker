import express from "express";
import { query } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import roleMiddleware from "../middleware/roleMiddleware.js"; // Role checks
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  getAdherence,
  getExceptions,
} from "../controllers/attendanceController.js";

/*
Attendance Routes
Purpose
- Adherence and exception reporting.
*/

const attendanceRoutes = express.Router(); // Router for attendance endpoints

// Validate date query param
const dateValidators = [
  query("date").isString().notEmpty().withMessage("date is required"),
];

// GET /api/attendance/adherence - full adherence report
attendanceRoutes.get(
  "/adherence",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Restrict to managers/admins
  dateValidators, // Validate query
  validateMiddleware, // Return 400 on validation errors
  getAdherence // Compare planned vs actual
);

// GET /api/attendance/exceptions - deviations and unlogged only
attendanceRoutes.get(
  "/exceptions",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Restrict to managers/admins
  dateValidators, // Validate query
  validateMiddleware, // Return 400 on validation errors
  getExceptions // Filter exceptions
);

export default attendanceRoutes;
