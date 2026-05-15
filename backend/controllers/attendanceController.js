import ShiftPlan from "../models/ShiftPlan.js"; // Planned shifts
import WorkLog from "../models/WorkLog.js"; // Actual work logs
import { getAttendanceStatus } from "../utils/attendanceUtils.js"; // Comparison utility

// GET /api/attendance/adherence - compare plan vs actual for a date
export const getAdherence = async (req, res) => {
	try {
		const date = req.query?.date; // Expected YYYY-MM-DD
		if (!date) {
			return res.status(400).json({ success: false, message: "date is required" });
		}

		const plans = await ShiftPlan.find({ date })
			.populate("userId", "name email") // Include user info
			.sort({ createdAt: 1 });

		const logs = await WorkLog.find({ date }); // Load all logs once

		const logMap = new Map(); // Fast lookup by user+date
		for (const log of logs) {
			logMap.set(`${log.userId}_${log.date}`, log);
		}

		const results = []; // Final adherence report
		for (const plan of plans) {
			const log = logMap.get(`${plan.userId._id}_${date}`); // Match log to plan
			const status = getAttendanceStatus(plan.plannedMode, log?.actualMode); // Compare

			results.push({
				employee: plan.userId?.name || "Unknown",
				plannedMode: plan.plannedMode,
				actualMode: log?.actualMode || "UNLOGGED",
				status,
			});
		}

		return res.status(200).json({ success: true, data: results });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch adherence" });
	}
};

// GET /api/attendance/exceptions - return deviations and unlogged only
export const getExceptions = async (req, res) => {
	try {
		const date = req.query?.date; // Expected YYYY-MM-DD
		if (!date) {
			return res.status(400).json({ success: false, message: "date is required" });
		}

		const plans = await ShiftPlan.find({ date })
			.populate("userId", "name email") // Include user info
			.sort({ createdAt: 1 });

		const logs = await WorkLog.find({ date }); // Load all logs once

		const logMap = new Map(); // Fast lookup by user+date
		for (const log of logs) {
			logMap.set(`${log.userId}_${log.date}`, log);
		}

		const exceptions = []; // Deviations and unlogged only
		for (const plan of plans) {
			const log = logMap.get(`${plan.userId._id}_${date}`);
			const status = getAttendanceStatus(plan.plannedMode, log?.actualMode);

			if (status === "DEVIATION" || status === "UNLOGGED") {
				exceptions.push({
					employee: plan.userId?.name || "Unknown",
					plannedMode: plan.plannedMode,
					actualMode: log?.actualMode || "UNLOGGED",
					status,
				});
			}
		}

		return res.status(200).json({ success: true, data: exceptions });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch exceptions" });
	}
};
