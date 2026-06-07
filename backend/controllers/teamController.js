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
		const managerId = team.managerId?._id || team.managerId;
		return String(managerId) === String(req.user._id);
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

		// Update both manager and members with the team ID
		const allUserIds = [...new Set([managerId, ...memberIds])];
		await User.updateMany(
			{ _id: { $in: allUserIds } },
			{ $set: { teamId: team._id } },
			{ session }
		);

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
		// Managers see teams where they are manager OR member
		if (req.user?.role === "MANAGER") {
			query.$or = [
				{ managerId: req.user._id },           // Teams they manage
				{ members: req.user._id }               // Teams they're a member of
			];
		}

		const teams = await Team.find(query)
			.populate("managerId", "name email")
			.sort({ createdAt: -1 });
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

/**
 * GET /api/teams/:id/overview
 * Returns team overview metrics for dashboard
 */
export const getTeamOverview = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id).populate("managerId", "name email");
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Managers can only view their own teams
		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const ShiftPlan = mongoose.model("ShiftPlan");
		const WorkLog = mongoose.model("WorkLog");
		const today = new Date().toISOString().slice(0, 10);

		// Get today's shift plans for team members
		const shiftPlans = await ShiftPlan.find({
			userId: { $in: team.members },
			date: today,
		});

		const workLogs = await WorkLog.find({
			userId: { $in: team.members },
			date: today,
		});

		const officeToday = shiftPlans.filter((sp) => sp.plannedMode === "OFFICE").length;
		const remoteToday = shiftPlans.filter((sp) => sp.plannedMode === "REMOTE").length;
		const hybridToday = shiftPlans.filter((sp) => sp.plannedMode === "HYBRID").length;
		const unlogged = workLogs.filter((wl) => wl.actualMode === "UNLOGGED").length;

		return res.status(200).json({
			teamName: team.name,
			memberCount: team.members.length,
			officeToday,
			remoteToday,
			hybridToday,
			unlogged,
			officeCapacity: team.officeCapacity,
			manager: team.managerId,
			site: team.site,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch team overview" });
	}
};

/**
 * GET /api/teams/:id/occupancy
 * Returns office occupancy data
 */
export const getTeamOccupancy = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const ShiftPlan = mongoose.model("ShiftPlan");
		const today = new Date().toISOString().slice(0, 10);

		// Count office plans for today
		const officePlans = await ShiftPlan.countDocuments({
			userId: { $in: team.members },
			date: today,
			plannedMode: { $in: ["OFFICE", "HYBRID"] },
		});

		const capacity = team.officeCapacity || 0;
		const occupied = officePlans;
		const available = Math.max(0, capacity - occupied);

		return res.status(200).json({
			capacity,
			occupied,
			available,
			occupancyPercentage: capacity > 0 ? Math.round((occupied / capacity) * 100) : 0,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch occupancy" });
	}
};

/**
 * GET /api/teams/:id/productivity
 * Returns team productivity metrics
 */
export const getTeamProductivity = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const Task = mongoose.model("Task");
		const WorkLog = mongoose.model("WorkLog");
		const today = new Date().toISOString().slice(0, 10);

		// Count completed tasks (DONE status)
		const tasksCompleted = await Task.countDocuments({
			assignedTo: { $in: team.members },
			status: "DONE",
			completedAt: {
				$gte: new Date(today),
				$lt: new Date(today + "T23:59:59Z"),
			},
		});

		// Calculate average worked hours
		const workLogs = await WorkLog.find({
			userId: { $in: team.members },
			date: today,
		});

		const totalHours = workLogs.reduce((sum, wl) => sum + (wl.workedHours || 0), 0);
		const averageHours = workLogs.length > 0 ? (totalHours / workLogs.length).toFixed(1) : 0;

		// Count pending reviews (READY_FOR_REVIEW tasks assigned to team members)
		const pendingReviews = await Task.countDocuments({
			assignedBy: { $in: team.members },
			status: "READY_FOR_REVIEW",
		});

		return res.status(200).json({
			tasksCompleted,
			averageHours: parseFloat(averageHours),
			pendingReviews,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch productivity" });
	}
};

/**
 * GET /api/teams/:id/daily-snapshot
 * Returns today's team snapshot with member details
 */
export const getTeamDailySnapshot = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		if (!canManageTeam(req, team)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const ShiftPlan = mongoose.model("ShiftPlan");
		const WorkLog = mongoose.model("WorkLog");
		const today = new Date().toISOString().slice(0, 10);

		// Get all team members with today's plans and logs
		const members = await User.find({ _id: { $in: team.members } });

		const memberDetails = await Promise.all(
			members.map(async (member) => {
				const shiftPlan = await ShiftPlan.findOne({
					userId: member._id,
					date: today,
				});

				const workLog = await WorkLog.findOne({
					userId: member._id,
					date: today,
				});

				const plannedMode = shiftPlan?.plannedMode || "OFF";
				const actualMode = workLog?.actualMode || "UNLOGGED";

				let attendanceStatus = "MATCH";
				if (actualMode === "UNLOGGED") {
					attendanceStatus = "UNLOGGED";
				} else if (
					plannedMode !== "OFF" &&
					actualMode !== "OFF" &&
					!actualMode.includes(plannedMode)
				) {
					attendanceStatus = "DEVIATION";
				} else if (plannedMode === "OFF" && actualMode !== "OFF" && actualMode !== "ABSENT") {
					attendanceStatus = "UNEXPECTED";
				}

				return {
					employee: member.name,
					role: member.role,
					plannedMode,
					actualMode,
					attendanceStatus,
					workedHours: workLog?.workedHours || 0,
				};
			})
		);

		return res.status(200).json({
			date: today,
			teamName: team.name,
			members: memberDetails,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch team snapshot" });
	}
};

/**
 * GET /api/teams/my-team
 * Returns the user's own team (if they have a teamId)
 * Allows any authenticated user to view their own team
 */
export const getMyTeam = async (req, res) => {
	try {
		if (!req.user?.teamId) {
			return res.status(404).json({ message: "You are not assigned to any team" });
		}

		const team = await Team.findById(req.user.teamId).populate("managerId", "name email");
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		return res.status(200).json({ team });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch your team" });
	}
};
