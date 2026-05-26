import mongoose from "mongoose";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { createAuditLog } from "../services/auditService.js"; // Central audit logger
import { AUDIT_ACTIONS } from "../constants/auditActions.js"; // Audit action codes

/*
Team Controller
Purpose
- Manage team lifecycle and membership for planning and dashboards.
- Enforce role-based access and keep Team.members and User.teamId in sync.
*/

const canManageTeam = (req, team) => {
	if (!req.user) return false;
	if (req.user.role === "SYSTEM_ADMIN") return true;
	if (req.user.role === "MANAGER") {
		return String(team.managerId) === String(req.user._id);
	}
	return false;
};

const normalizeMemberIds = (payload) => {
	if (!payload) return [];
	if (Array.isArray(payload)) return payload;
	return [payload];
};

export const createTeam = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		// Validate minimum required fields for a team.
		const { name, managerId, members, site, officeCapacity } = req.body || {};
		if (!name || !managerId) {
			return res.status(400).json({ message: "name and managerId are required" });
		}

		const manager = await User.findById(managerId);
		if (!manager) {
			return res.status(404).json({ message: "Manager not found" });
		}

		const memberIds = Array.from(new Set(normalizeMemberIds(members).map(String)));

		if (memberIds.length > 0) {
			const existingMembers = await User.find({ _id: { $in: memberIds } });
			if (existingMembers.length !== memberIds.length) {
				return res.status(404).json({ message: "One or more members not found" });
			}

			const alreadyAssigned = existingMembers.filter((user) => user.teamId);
			if (alreadyAssigned.length > 0) {
				return res.status(409).json({ message: "Some members already belong to another team" });
			}
		}

		// Create team and update member references atomically.
		session.startTransaction();
		const [team] = await Team.create(
			[
				{
					name,
					managerId,
					members: memberIds,
					site,
					officeCapacity,
				},
			],
			{ session }
		);

		if (memberIds.length > 0) {
			await User.updateMany(
				{ _id: { $in: memberIds } },
				{ $set: { teamId: team._id } },
				{ session }
			);
		}

		await session.commitTransaction();
		return res.status(201).json({ team });
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({ message: error.message || "Failed to create team" });
	} finally {
		session.endSession();
	}
};

export const listTeams = async (req, res) => {
	try {
		const query = {};
		// Managers only see their own teams.
		if (req.user?.role === "MANAGER") {
			query.managerId = req.user._id;
		}

		const teams = await Team.find(query).sort({ createdAt: -1 });
		return res.status(200).json({ teams });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch teams" });
	}
};

export const getTeamById = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Managers can only access their own teams.
		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		return res.status(200).json({ team });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch team" });
	}
};

export const updateTeam = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Enforce ownership or admin privilege.
		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		if (req.body?.managerId && req.user?.role !== "SYSTEM_ADMIN") {
			return res.status(403).json({ message: "Only admins can change manager" });
		}

		if (req.body?.managerId) {
			const newManager = await User.findById(req.body.managerId);
			if (!newManager) {
				return res.status(404).json({ message: "Manager not found" });
			}
		}

		const updates = {};
		// Apply only explicit fields to avoid unintended overwrites.
		if (req.body?.name !== undefined) updates.name = req.body.name;
		if (req.body?.site !== undefined) updates.site = req.body.site;
		if (req.body?.officeCapacity !== undefined) updates.officeCapacity = req.body.officeCapacity;
		if (req.body?.managerId !== undefined) updates.managerId = req.body.managerId;

		const updated = await Team.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
		return res.status(200).json({ team: updated });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to update team" });
	}
};

export const addMembers = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Managers can only update their own teams.
		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const memberIds = Array.from(
			new Set(normalizeMemberIds(req.body?.memberIds || req.body?.userId).map(String))
		);

		if (memberIds.length === 0) {
			return res.status(400).json({ message: "memberIds or userId is required" });
		}

		const users = await User.find({ _id: { $in: memberIds } });
		if (users.length !== memberIds.length) {
			return res.status(404).json({ message: "One or more members not found" });
		}

		// Prevent cross-team membership if single-team policy is enforced.
		const alreadyAssigned = users.filter((user) => user.teamId && String(user.teamId) !== String(team._id));
		if (alreadyAssigned.length > 0) {
			return res.status(409).json({ message: "Some members already belong to another team" });
		}

		// Keep Team.members and User.teamId consistent using a transaction.
		session.startTransaction();
		await Team.updateOne(
			{ _id: team._id },
			{ $addToSet: { members: { $each: memberIds } } },
			{ session }
		);

		await User.updateMany(
			{ _id: { $in: memberIds } },
			{ $set: { teamId: team._id } },
			{ session }
		);

		await session.commitTransaction();
		const updated = await Team.findById(team._id);

		await createAuditLog({
			actorId: req.user._id,
			action: AUDIT_ACTIONS.ADD_TEAM_MEMBER,
			entity: "Team",
			entityId: team._id,
			after: {
				addedUserIds: memberIds,
			},
			metadata: {
				teamName: team.name,
			},
		});

		return res.status(200).json({ team: updated });
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({ message: error.message || "Failed to add members" });
	} finally {
		session.endSession();
	}
};

export const removeMember = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		const { id, userId } = req.params;
		const team = await Team.findById(id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Managers can only update their own teams.
		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		// Keep the manager attached to the team.
		if (String(team.managerId) === String(userId)) {
			return res.status(400).json({ message: "Manager cannot be removed from team" });
		}

		// Keep Team.members and User.teamId consistent using a transaction.
		session.startTransaction();
		await Team.updateOne(
			{ _id: team._id },
			{ $pull: { members: userId } },
			{ session }
		);

		await User.updateOne(
			{ _id: userId, teamId: team._id },
			{ $set: { teamId: null } },
			{ session }
		);

		await session.commitTransaction();
		const updated = await Team.findById(team._id);

		await createAuditLog({
			actorId: req.user._id,
			action: AUDIT_ACTIONS.REMOVE_TEAM_MEMBER,
			entity: "Team",
			entityId: team._id,
			after: {
				removedUserId: userId,
			},
			metadata: {
				teamName: team.name,
			},
		});

		return res.status(200).json({ team: updated });
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({ message: error.message || "Failed to remove member" });
	} finally {
		session.endSession();
	}
};
