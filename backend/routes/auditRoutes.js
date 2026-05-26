import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getAuditHistory } from "../controllers/auditController.js";

const auditRoutes = express.Router();

auditRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware("MANAGER", "SYSTEM_ADMIN"),
  getAuditHistory
);

export default auditRoutes;
