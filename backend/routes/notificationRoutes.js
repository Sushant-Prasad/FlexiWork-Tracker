import express from "express";
import { param, query } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; // Auth protection
import validateMiddleware from "../middleware/validateMiddleware.js"; // Request validation
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";

/*
Notification Routes
Purpose
- Fetch and manage user notifications.
*/

const notificationRoutes = express.Router(); // Router for notification endpoints

const idParam = [param("id").isMongoId().withMessage("Notification id must be valid")];
const paginationValidators = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be 1-100"),
];

// GET /api/notifications/me - list notifications
notificationRoutes.get(
  "/me",
  authMiddleware, // Require authenticated user
  paginationValidators, // Validate pagination params
  validateMiddleware, // Return 400 on validation errors
  getNotifications // Fetch notifications
);

// PATCH /api/notifications/:id/read - mark one as read
notificationRoutes.patch(
  "/:id/read",
  authMiddleware, // Require authenticated user
  idParam, // Validate id
  validateMiddleware, // Return 400 on validation errors
  markAsRead // Mark one as read
);

// PATCH /api/notifications/read-all - mark all as read
notificationRoutes.patch(
  "/read-all",
  authMiddleware, // Require authenticated user
  markAllAsRead // Mark all as read
);

// DELETE /api/notifications/:id - delete notification
notificationRoutes.delete(
  "/:id",
  authMiddleware, // Require authenticated user
  idParam, // Validate id
  validateMiddleware, // Return 400 on validation errors
  deleteNotification // Delete notification
);

export default notificationRoutes;
