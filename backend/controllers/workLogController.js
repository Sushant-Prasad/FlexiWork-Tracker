import WorkLog from "../models/WorkLog.js"; // Work log model
import { getEditableUntil, getTodayDate } from "../utils/dateUtils.js"; // Date helpers
import { calculateWorkedHours } from "../utils/calculateWorkedHours.js"; // Hours calculator

// Create or update today's work log for the logged-in user
export const createOrUpdateWorkLog = async (req, res) => {
	try {
		const user = req.user; // Authenticated user
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const today = getTodayDate(); // Current date in YYYY-MM-DD
		const { actualMode, comments, checkInAt, checkOutAt, geo } = req.body || {};

		const existingLog = await WorkLog.findOne({ userId: user._id, date: today }); // Check if log exists

		if (existingLog) {
			if (existingLog.editableUntil && new Date() > existingLog.editableUntil) {
				return res.status(403).json({ success: false, message: "Edit window closed" });
			}

			if (actualMode !== undefined) existingLog.actualMode = actualMode; // Update mode if provided
			if (comments !== undefined) existingLog.comments = comments; // Update comments if provided
			if (checkInAt !== undefined) existingLog.checkInAt = checkInAt; // Update check-in time
			if (checkOutAt !== undefined) existingLog.checkOutAt = checkOutAt; // Update check-out time

			if (user.settings?.geoCheckOptIn && geo) {
				existingLog.geo = geo; // Save geo only when opt-in is enabled
			}

			existingLog.workedHours = calculateWorkedHours(
				existingLog.checkInAt,
				existingLog.checkOutAt
			); // Recalculate worked hours

			await existingLog.save(); // Persist updates

			return res.status(200).json({
				success: true,
				message: "WorkLog updated successfully",
				data: { log: existingLog },
			});
		}

		const newLog = new WorkLog({
			userId: user._id,
			date: today,
			actualMode: actualMode || "UNLOGGED", // Default to UNLOGGED if not provided
			comments: comments || "",
			checkInAt,
			checkOutAt,
			editableUntil: getEditableUntil(), // Set today's cutoff time
		});

		if (user.settings?.geoCheckOptIn && geo) {
			newLog.geo = geo; // Save geo only when opt-in is enabled
		}

		newLog.workedHours = calculateWorkedHours(newLog.checkInAt, newLog.checkOutAt); // Calculate hours

		await newLog.save(); // Create new log

		return res.status(201).json({
			success: true,
			message: "WorkLog created successfully",
			data: { log: newLog },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to create or update work log",
		});
	}
};

// Update checkout time and comments for a specific work log
export const updateWorkLog = async (req, res) => {
	try {
		const user = req.user; // Authenticated user
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const log = await WorkLog.findById(req.params.id); // Find log by id
		if (!log) {
			return res.status(404).json({ success: false, message: "WorkLog not found" });
		}

		if (String(log.userId) !== String(user._id)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		if (log.editableUntil && new Date() > log.editableUntil) {
			return res.status(403).json({ success: false, message: "Edit window closed" });
		}

		const { checkOutAt, comments } = req.body || {};
		if (checkOutAt !== undefined) log.checkOutAt = checkOutAt; // Update checkout time
		if (comments !== undefined) log.comments = comments; // Update comments

		log.workedHours = calculateWorkedHours(log.checkInAt, log.checkOutAt); // Recalculate hours

		await log.save(); // Save updates

		return res.status(200).json({
			success: true,
			message: "WorkLog updated successfully",
			data: { log },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to update work log",
		});
	}
};

// Get work log history for the logged-in user
export const getMyWorkLogs = async (req, res) => {
	try {
		const user = req.user; // Authenticated user
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const page = Number(req.query?.page || 1); // Optional pagination
		const limit = Number(req.query?.limit || 20); // Optional pagination
		const skip = (page - 1) * limit; // Offset for pagination

		const logs = await WorkLog.find({ userId: user._id })
			.sort({ date: -1 }) // Latest first
			.skip(skip)
			.limit(limit);

		return res.status(200).json({
			success: true,
			message: "WorkLogs fetched successfully",
			data: { logs, page, limit },
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch work logs",
		});
	}
};
