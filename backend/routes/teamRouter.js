import express from "express";
import { body, param } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
  addMembers,
  createTeam,
  getTeamById,
  listTeams,
  removeMember,
  updateTeam,
} from "../controllers/teamController.js";

/*
Team Routes
Purpose
*/

const teamRouter = express.Router();

// Common param validators to keep handlers clean.
const teamIdParam = [param("id").isMongoId().withMessage("Team id must be valid")];
const userIdParam = [param("userId").isMongoId().withMessage("User id must be valid")];

// Validation rules for create/update payloads.
const createTeamValidators = [
  body("name").isString().trim().notEmpty().withMessage("name is required"),
  body("managerId").isMongoId().withMessage("managerId must be valid"),
  body("members").optional().isArray().withMessage("members must be an array of user ids"),
  body("members.*").optional().isMongoId().withMessage("member id must be valid"),
  body("site").optional().isString().isLength({ max: 50 }),
  body("officeCapacity").optional().isInt({ min: 0 }),
];

const updateTeamValidators = [
  body("name").optional().isString().trim().notEmpty(),
  body("managerId").optional().isMongoId(),
  body("site").optional().isString().isLength({ max: 50 }),
  body("officeCapacity").optional().isInt({ min: 0 }),
];

const addMembersValidators = [
  body("memberIds").optional().isArray().withMessage("memberIds must be an array"),
  body("memberIds.*").optional().isMongoId().withMessage("member id must be valid"),
  body("userId").optional().isMongoId().withMessage("userId must be valid"),
];

// POST /api/teams - create team (SYSTEM_ADMIN only)
teamRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("SYSTEM_ADMIN"),
  createTeamValidators,
  validateMiddleware,
  createTeam
);

// GET /api/teams - list teams (SYSTEM_ADMIN, MANAGER)
teamRouter.get("/", authMiddleware, roleMiddleware("SYSTEM_ADMIN", "MANAGER"), listTeams);

// GET /api/teams/:id - team detail (SYSTEM_ADMIN, MANAGER)
teamRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("SYSTEM_ADMIN", "MANAGER"),
  teamIdParam,
  validateMiddleware,
  getTeamById
);

// PUT /api/teams/:id - update team fields (SYSTEM_ADMIN, MANAGER)
teamRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("SYSTEM_ADMIN", "MANAGER"),
  teamIdParam,
  updateTeamValidators,
  validateMiddleware,
  updateTeam
);

// POST /api/teams/:id/members - add members (SYSTEM_ADMIN, MANAGER)
teamRouter.post(
  "/:id/members",
  authMiddleware,
  roleMiddleware("SYSTEM_ADMIN", "MANAGER"),
  teamIdParam,
  addMembersValidators,
  validateMiddleware,
  addMembers
);

// DELETE /api/teams/:id/members/:userId - remove member (SYSTEM_ADMIN, MANAGER)
teamRouter.delete(
  "/:id/members/:userId",
  authMiddleware,
  roleMiddleware("SYSTEM_ADMIN", "MANAGER"),
  teamIdParam,
  userIdParam,
  validateMiddleware,
  removeMember
);

export default teamRouter;
