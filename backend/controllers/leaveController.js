import LeaveRequest from "../models/LeaveRequest.js"; // Leave requests
import ShiftPlan from "../models/ShiftPlan.js"; // Shift plans
import { canApplyLeave, canApproveLeave } from "../utils/leavePermissions.js"; // Permission checks
import { isValidLeaveTransition } from "../utils/leaveStatusFlow.js"; // Status transitions
import { validateLeaveRequest } from "../utils/leaveValidation.js"; // Leave validation
import { sendNotification } from "../utils/sendNotification.js"; // Notification helper

// POST /api/leaves - employee applies for leave
export const createLeaveRequest = async (req, res) => {
	try {
		if (!canApplyLeave(req.user?.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const { type, startDate, endDate, reason } = req.body || {};

		const existingApproved = await LeaveRequest.find({
			userId: req.user._id,
			status: "APPROVED",
		}).select("startDate endDate");

		const validation = validateLeaveRequest(
			{ type, startDate, endDate, reason },
			{ existingLeaves: existingApproved }
		);

		if (!validation.isValid) {
			return res.status(400).json({ success: false, message: "Validation failed", errors: validation.errors });
		}

		const leave = await LeaveRequest.create({
			userId: req.user._id,
			type,
			startDate,
			endDate,
			reason: reason || "",
			status: "PENDING",
		});

		return res.status(201).json({
			success: true,
			message: "Leave request created successfully",
			data: leave,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to create leave request" });
	}
};

// GET /api/leaves/me - get logged-in user's leave requests
export const getMyLeaves = async (req, res) => {
	try {
		const leaves = await LeaveRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });

		return res.status(200).json({ success: true, count: leaves.length, data: leaves });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch leaves" });
	}
};

// GET /api/leaves/pending - manager/admin view pending approvals
export const getPendingLeaves = async (req, res) => {
	try {
		if (!canApproveLeave(req.user?.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const leaves = await LeaveRequest.find({ status: "PENDING" }).populate("userId", "name email");

		return res.status(200).json({ success: true, count: leaves.length, data: leaves });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch pending leaves" });
	}
};

// PATCH /api/leaves/:id/approve - manager/admin approves leave
export const approveLeave = async (req, res) => {
	try {
		if (!canApproveLeave(req.user?.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const leave = await LeaveRequest.findById(req.params.id); // Load leave request
		if (!leave) {
			return res.status(404).json({ success: false, message: "Leave request not found" });
		}

		if (String(leave.userId) === String(req.user._id)) {
			return res.status(403).json({ success: false, message: "Cannot approve your own leave" });
		}

		const allowed = isValidLeaveTransition(leave.status, "APPROVED");
		if (!allowed) {
			return res.status(400).json({ success: false, message: "Invalid status transition" });
		}

		leave.status = "APPROVED";
		leave.approverId = req.user._id; // Track approver
		leave.reviewedAt = new Date(); // Record review time
		leave.decisionAt = leave.reviewedAt; // Keep legacy field updated

		await leave.save();

		await ShiftPlan.updateMany(
			{
				userId: leave.userId,
				date: { $gte: leave.startDate, $lte: leave.endDate },
			},
			{
				plannedMode: "OFF",
				plannedOffice: undefined,
			}
		);

		await sendNotification({
			userId: leave.userId,
			title: "Leave approved",
			message: `Your leave request from ${leave.startDate} to ${leave.endDate} has been approved.`,
			type: "LEAVE_APPROVED",
			relatedId: leave._id,
		});

		return res.status(200).json({ success: true, message: "Leave approved", data: leave });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to approve leave" });
	}
};

// PATCH /api/leaves/:id/reject - manager/admin rejects leave
export const rejectLeave = async (req, res) => {
	try {
		if (!canApproveLeave(req.user?.role)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		const leave = await LeaveRequest.findById(req.params.id); // Load leave request
		if (!leave) {
			return res.status(404).json({ success: false, message: "Leave request not found" });
		}

		if (String(leave.userId) === String(req.user._id)) {
			return res.status(403).json({ success: false, message: "Cannot reject your own leave" });
		}

		const allowed = isValidLeaveTransition(leave.status, "REJECTED");
		if (!allowed) {
			return res.status(400).json({ success: false, message: "Invalid status transition" });
		}

		leave.status = "REJECTED";
		leave.approverId = req.user._id; // Track approver
		leave.reviewedAt = new Date(); // Record review time
		leave.decisionAt = leave.reviewedAt; // Keep legacy field updated

		await leave.save();

		await sendNotification({
			userId: leave.userId,
			title: "Leave rejected",
			message: `Your leave request from ${leave.startDate} to ${leave.endDate} was rejected.`,
			type: "LEAVE_REJECTED",
			relatedId: leave._id,
		});

		return res.status(200).json({ success: true, message: "Leave rejected", data: leave });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to reject leave" });
	}
};
