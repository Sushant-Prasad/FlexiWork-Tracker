import express from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
  createShiftPlans,
  deleteShiftPlan,
  getTeamPlans,
  publishPlans,
  updateShiftPlan,
} from "../controllers/shiftPlanController.js";

/*
Shift Plan Routes
Purpose
- Create, fetch, update, publish, and delete shift plans.
*/

const shiftPlanRoutes = express.Router(); // Router for shift plan endpoints

const planIdParam = [param("id").isMongoId().withMessage("Plan id must be valid")]; // Validate plan id path param

// Validate payload for bulk creation
const bulkCreateValidators = [
  body().isArray({ min: 1 }).withMessage("Request body must be a non-empty array"),
  body("*.userId").isMongoId().withMessage("userId must be valid"),
  body("*.date").isString().notEmpty().withMessage("date is required"),
  body("*.plannedMode").isString().notEmpty().withMessage("plannedMode is required"),
  body("*.plannedOffice").optional().isObject(),
  body("*.plannedOffice.site").optional().isString(),
  body("*.plannedOffice.desk").optional().isString(),
  body("*.notes").optional().isString(),
];

// Validate fields for update requests
const updateValidators = [
  body("plannedMode").optional().isString(),
  body("plannedOffice").optional().isObject(),
  body("plannedOffice.site").optional().isString(),
  body("plannedOffice.desk").optional().isString(),
  body("notes").optional().isString(),
];

// Validate team fetch query params
const teamQueryValidators = [
  query("teamId").optional().isMongoId().withMessage("teamId must be valid"),
  query("startDate").optional().isString(),
  query("endDate").optional().isString(),
];

// Validate publish payload
const publishValidators = [
  body("teamId").isMongoId().withMessage("teamId must be valid"),
  body("startDate").optional().isString(),
  body("endDate").optional().isString(),
];

shiftPlanRoutes.post(
  "/bulk",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Managers and admins can create plans
  bulkCreateValidators, // Validate bulk request body
  validateMiddleware, // Return 400 on validation errors
  createShiftPlans // Create plans in bulk
);

shiftPlanRoutes.get(
  "/team",
  authMiddleware, // Require authenticated user
  teamQueryValidators, // Validate query params
  validateMiddleware, // Return 400 on validation errors
  getTeamPlans // Fetch team plans
);

shiftPlanRoutes.patch(
  "/:id",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Restrict to managers/admins
  planIdParam, // Validate plan id
  updateValidators, // Validate update body
  validateMiddleware, // Return 400 on validation errors
  updateShiftPlan // Apply plan updates
);

shiftPlanRoutes.post(
  "/publish",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Restrict to managers/admins
  publishValidators, // Validate publish body
  validateMiddleware, // Return 400 on validation errors
  publishPlans // Lock plans and notify users
);

shiftPlanRoutes.delete(
  "/:id",
  authMiddleware, // Require authenticated user
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"), // Restrict to managers/admins
  planIdParam, // Validate plan id
  validateMiddleware, // Return 400 on validation errors
  deleteShiftPlan // Remove the plan
);

export default shiftPlanRoutes;
