import ShiftPlan from "../models/ShiftPlan.js"; // Shift plan collection
import LeaveRequest from "../models/LeaveRequest.js"; // Leave requests for conflict checks
import { sendNotification } from "../utils/sendNotification.js"; // Notification helper
import { createAuditLog } from "../services/auditService.js"; // Central audit logger
import { AUDIT_ACTIONS } from "../constants/auditActions.js"; // Audit action codes
import Team from "../models/Team.js"; // Team data for access and capacity
import User from "../models/User.js"; // User data for ownership checks
import {
	findDuplicateKeys,
	isValidShiftMode,
	normalizeOffice,
	requiresOfficeInfo,
	validatePlanBasics,
} from "../utils/validateShiftPlan.js";

// Ensure requester can manage the user's plan
const ensureManagerAccess = async (req, userId) => {
	if (req.user?.role === "SYSTEM_ADMIN") return true;
	if (req.user?.role !== "MANAGER") return false;

	const user = await User.findById(userId).select("teamId"); // Get user's team
	if (!user?.teamId) return false;

	const team = await Team.findById(user.teamId).select("managerId"); // Load team manager
	if (!team) return false;

	return String(team.managerId) === String(req.user._id);
};

// Preload team records for a list of users
const loadTeamsForUsers = async (users) => {
	const teamIds = Array.from(
		new Set(users.map((user) => user.teamId).filter(Boolean).map(String))
	);
	if (teamIds.length === 0) return new Map();

	const teams = await Team.find({ _id: { $in: teamIds } }); // Fetch all referenced teams
	return new Map(teams.map((team) => [String(team._id), team]));
};

// Convert optional date inputs into a MongoDB range filter
const buildDateRangeFilter = (startDate, endDate) => {
	if (!startDate && !endDate) return null;
	const range = {};
	if (startDate) range.$gte = startDate;
	if (endDate) range.$lte = endDate;
	return range;
};

// Group office plans by date and site for capacity checks
const collectCapacityBuckets = (plans) => {
	const buckets = new Map();

	for (const plan of plans) {
		if (!requiresOfficeInfo(plan.plannedMode)) continue; // Only office-based modes count
		const office = normalizeOffice(plan.plannedOffice); // Normalize office fields
		if (!office.site) continue; // Skip if no site provided

		const key = `${plan.date}::${office.site}`; // Aggregate per date and site
		const current = buckets.get(key) || { date: plan.date, site: office.site, count: 0 };
		current.count += 1;
		buckets.set(key, current);
	}

	return Array.from(buckets.values());
};

// Bulk create shift plans for multiple employees
export const createShiftPlans = async (req, res) => {
	try {
		const plans = Array.isArray(req.body) ? req.body : []; // Normalize request body
		if (plans.length === 0) {
			return res.status(400).json({ message: "Request body must be a non-empty array" });
		}

		const validationErrors = []; // Collect per-plan validation errors
		plans.forEach((plan, index) => {
			const errors = validatePlanBasics(plan); // Validate required fields and mode
			if (errors.length > 0) {
				validationErrors.push({ index, errors });
			}
		});

		if (validationErrors.length > 0) {
			return res.status(400).json({ message: "Validation failed", errors: validationErrors });
		}

		const duplicates = findDuplicateKeys(plans); // Prevent duplicates in payload
		if (duplicates.length > 0) {
			return res.status(409).json({ message: "Duplicate plans in payload", duplicates });
		}

		const userIds = Array.from(new Set(plans.map((plan) => String(plan.userId)))); // Unique users
		const users = await User.find({ _id: { $in: userIds } }).select("_id teamId"); // Load users
		if (users.length !== userIds.length) {
			return res.status(404).json({ message: "One or more users not found" });
		}

		const userById = new Map(users.map((user) => [String(user._id), user])); // Fast lookup

		const existingPlans = await ShiftPlan.find({ // Enforce one plan per user per day
			$or: plans.map((plan) => ({ userId: plan.userId, date: plan.date })),
		}).select("userId date");

		if (existingPlans.length > 0) {
			return res.status(409).json({ message: "Some plans already exist" });
		}

		const teamsById = await loadTeamsForUsers(users); // Preload team capacity/site

		for (const plan of plans) {
			if (requiresOfficeInfo(plan.plannedMode)) {
				const office = normalizeOffice(plan.plannedOffice); // Normalize office info
				const team = teamsById.get(String(userById.get(String(plan.userId))?.teamId)); // Resolve team

				if (!office.site && team?.site) {
					plan.plannedOffice = { ...plan.plannedOffice, site: team.site };
				}
			}
		}

		const capacityBuckets = collectCapacityBuckets(plans); // Group office counts
		for (const bucket of capacityBuckets) {
			const samplePlan = plans.find(
				(plan) => plan.date === bucket.date && normalizeOffice(plan.plannedOffice).site === bucket.site
			);
			const user = userById.get(String(samplePlan?.userId)); // Any user in that bucket
			const team = teamsById.get(String(user?.teamId)); // Team for capacity

			if (!team || !team.officeCapacity || team.officeCapacity <= 0) {
				continue;
			}

			const existingCount = await ShiftPlan.countDocuments({ // Current OFFICE plans
				date: bucket.date,
				plannedMode: "OFFICE",
				"plannedOffice.site": bucket.site,
			});

			if (existingCount + bucket.count > team.officeCapacity) {
				return res.status(409).json({
					message: "Office capacity exceeded",
					date: bucket.date,
					site: bucket.site,
				});
			}
		}

		for (const plan of plans) {
			const leave = await LeaveRequest.findOne({
				userId: plan.userId,
				status: "APPROVED",
				startDate: { $lte: plan.date },
				endDate: { $gte: plan.date },
			}).select("_id"); // Approved leave overlapping the date

			if (leave) {
				return res.status(409).json({
					message: "Leave conflict detected",
					userId: plan.userId,
					date: plan.date,
				});
			}
		}

		const payload = plans.map((plan) => ({
			userId: plan.userId,
			date: plan.date,
			plannedMode: plan.plannedMode,
			plannedOffice: plan.plannedMode === "OFF" ? undefined : normalizeOffice(plan.plannedOffice), // OFF clears office
			notes: plan.notes || "", // Default notes
			createdBy: req.user._id, // Track creator
		}));

		const createdPlans = await ShiftPlan.insertMany(payload); // Bulk insert

		await Promise.all(
			createdPlans.map((plan) =>
				createAuditLog({
					actorId: req.user._id,
					action: AUDIT_ACTIONS.CREATE_SHIFTPLAN,
					entity: "ShiftPlan",
					entityId: plan._id,
					after: {
						userId: plan.userId,
						date: plan.date,
						plannedMode: plan.plannedMode,
						plannedOffice: plan.plannedOffice,
						notes: plan.notes,
					},
				})
			)
		);

		return res.status(201).json({ plans: createdPlans });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to create plans" });
	}
};

// Fetch plans for a team within an optional date range
export const getTeamPlans = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.query;
		if (!teamId) {
			return res.status(400).json({ message: "teamId is required" });
		}

		const team = await Team.findById(teamId).select("members managerId"); // Load team
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		if (req.user?.role === "MANAGER" && String(team.managerId) !== String(req.user._id)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const dateRange = buildDateRangeFilter(startDate, endDate); // Optional date filter
		const query = { userId: { $in: team.members } };
		if (dateRange) query.date = dateRange;

		const plans = await ShiftPlan.find(query)
			.populate("userId", "name email")
			.sort({ date: 1, createdAt: 1 }); // Sort by date

		return res.status(200).json({ plans });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch team plans" });
	}
};

// Update a single shift plan with audit logging
export const updateShiftPlan = async (req, res) => {
	try {
		const plan = await ShiftPlan.findById(req.params.id); // Load plan
		if (!plan) {
			return res.status(404).json({ message: "Shift plan not found" });
		}

		if (plan.locked) {
			return res.status(403).json({ message: "Shift plan is locked" });
		}

		const canManage = await ensureManagerAccess(req, plan.userId);
		if (!canManage) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const updates = {}; // Build patch updates
		if (req.body?.plannedMode !== undefined) {
			if (!isValidShiftMode(req.body.plannedMode)) {
				return res.status(400).json({ message: "plannedMode is invalid" });
			}
			updates.plannedMode = req.body.plannedMode;
		}

		if (req.body?.plannedOffice !== undefined) {
			updates.plannedOffice = normalizeOffice(req.body.plannedOffice); // Normalize office fields
		}

		if (req.body?.notes !== undefined) {
			updates.notes = req.body.notes;
		}

		const nextMode = updates.plannedMode || plan.plannedMode; // Final mode after update
		const nextOffice = updates.plannedOffice || plan.plannedOffice; // Final office after update

		if (requiresOfficeInfo(nextMode)) {
			const office = normalizeOffice(nextOffice);
			if (!office.site) {
				return res.status(400).json({ message: "plannedOffice.site is required" });
			}
		}

		if (nextMode === "OFF") {
			updates.plannedOffice = undefined;
		}

		const leave = await LeaveRequest.findOne({
			userId: plan.userId,
			status: "APPROVED",
			startDate: { $lte: plan.date },
			endDate: { $gte: plan.date },
		}).select("_id"); // Prevent changing plans on approved leave

		if (leave) {
			return res.status(409).json({ message: "Leave conflict detected" });
		}

		const updated = await ShiftPlan.findByIdAndUpdate(plan._id, { $set: updates }, { new: true }); // Save

		await createAuditLog({
			actorId: req.user._id,
			action: AUDIT_ACTIONS.UPDATE_SHIFTPLAN,
			entity: "ShiftPlan",
			entityId: plan._id,
			before: {
				plannedMode: plan.plannedMode,
				plannedOffice: plan.plannedOffice,
				notes: plan.notes,
			},
			after: {
				plannedMode: updated.plannedMode,
				plannedOffice: updated.plannedOffice,
				notes: updated.notes,
			},
			reason: req.body?.reason || "",
			metadata: {
				userId: updated.userId,
				date: updated.date,
			},
		});

		return res.status(200).json({ plan: updated });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to update shift plan" });
	}
};

// Publish plans for a team and lock them
export const publishPlans = async (req, res) => {
	try {
		const { teamId, startDate, endDate } = req.body || {};
		const team = await Team.findById(teamId).select("members managerId"); // Load team
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		if (req.user?.role === "MANAGER" && String(team.managerId) !== String(req.user._id)) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		const dateRange = buildDateRangeFilter(startDate, endDate); // Optional date filter
		const query = { userId: { $in: team.members } };
		if (dateRange) query.date = dateRange;

		const plans = await ShiftPlan.find(query); // Fetch all plans
		const unlocked = plans.filter((plan) => !plan.locked); // Only publish unlocked plans

		if (unlocked.length === 0) {
			return res.status(200).json({ message: "No plans to publish" });
		}

		await ShiftPlan.updateMany(
			{ _id: { $in: unlocked.map((plan) => plan._id) } },
			{ $set: { locked: true } } // Lock plans after publish
		);

		const uniqueUsers = Array.from(
			new Set(unlocked.map((plan) => String(plan.userId)))
		); // Notify each user once

		if (uniqueUsers.length > 0) {
			await Promise.all(
				uniqueUsers.map((userId) =>
					sendNotification({
						userId,
						title: "Shift plans published",
						message: `Your shift plan has been published${startDate ? ` for ${startDate}` : ""}${endDate ? ` to ${endDate}` : ""}.`,
						type: "PLAN_PUBLISHED",
						relatedId: teamId,
					})
				)
			);
		}

		return res.status(200).json({ published: unlocked.length });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to publish plans" });
	}
};

// Delete a shift plan before it is locked
export const deleteShiftPlan = async (req, res) => {
	try {
		const plan = await ShiftPlan.findById(req.params.id); // Load plan
		if (!plan) {
			return res.status(404).json({ message: "Shift plan not found" });
		}

		if (plan.locked) {
			return res.status(403).json({ message: "Shift plan is locked" });
		}

		const canManage = await ensureManagerAccess(req, plan.userId);
		if (!canManage) {
			return res.status(403).json({ message: "Forbidden: insufficient role" });
		}

		await ShiftPlan.deleteOne({ _id: plan._id }); // Remove plan

		await createAuditLog({
			actorId: req.user._id,
			action: AUDIT_ACTIONS.DELETE_SHIFTPLAN,
			entity: "ShiftPlan",
			entityId: plan._id,
			before: {
				userId: plan.userId,
				date: plan.date,
				plannedMode: plan.plannedMode,
				plannedOffice: plan.plannedOffice,
				notes: plan.notes,
			},
			reason: req.body?.reason || "",
			metadata: {
				userId: plan.userId,
				date: plan.date,
			},
		});
		return res.status(200).json({ message: "Shift plan deleted" });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to delete shift plan" });
	}
};
