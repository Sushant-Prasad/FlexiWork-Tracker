import express from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
	createOrUpdateWorkLog,
	getTodayWorkLog,
	getMyWorkLogs,
	updateWorkLog,
} from "../controllers/workLogController.js";

/*
Work Log Routes
Purpose
- Create/update logs, update checkout, and fetch history.
*/

const workLogRouter = express.Router(); // Router for work log endpoints

// Validators for create/update payload
const createValidators = [
	body("actualMode").optional().isString(),
	body("comments").optional().isString(),
	body("checkInAt").optional().isISO8601().withMessage("checkInAt must be a valid ISO date"),
	body("checkOutAt").optional().isISO8601().withMessage("checkOutAt must be a valid ISO date"),
	body("geo").optional().isObject(),
	body("geo.lat").optional().isNumeric(),
	body("geo.lon").optional().isNumeric(),
	body("geo.capturedAt").optional().isISO8601(),
	body("geo.source").optional().isString(),
];

// Validators for update payload
const updateValidators = [
	param("id").isMongoId().withMessage("WorkLog id must be valid"),
	body("checkOutAt").optional().isISO8601().withMessage("checkOutAt must be a valid ISO date"),
	body("comments").optional().isString(),
];

// Validators for pagination
const listValidators = [
	query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
	query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100"),
];

// POST /api/worklogs - create or update today's work log
workLogRouter.post(
	"/",
	authMiddleware, // Require authenticated user
	createValidators, // Validate request body
	validateMiddleware, // Return 400 on validation errors
	createOrUpdateWorkLog // Create or update today's log
);

// PATCH /api/worklogs/:id - update checkout and comments
workLogRouter.patch(
	"/:id",
	authMiddleware, // Require authenticated user
	updateValidators, // Validate request params/body
	validateMiddleware, // Return 400 on validation errors
	updateWorkLog // Update checkout info
);

// GET /api/worklogs/me - list logged-in user's work logs
workLogRouter.get(
	"/me",
	authMiddleware, // Require authenticated user
	listValidators, // Validate pagination query
	validateMiddleware, // Return 400 on validation errors
	getMyWorkLogs // Fetch user history
);

// GET /api/worklogs/today - today's work log for the logged-in user
workLogRouter.get(
	"/today",
	authMiddleware, // Require authenticated user
	getTodayWorkLog
);

export default workLogRouter;
