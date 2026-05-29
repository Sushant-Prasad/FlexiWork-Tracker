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

// GET /api/attendance/summary - monthly summary for the logged-in user
export const getAttendanceSummary = async (req, res) => {
	try {
		const user = req.user; // Authenticated user
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const today = new Date();
		const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

		const startDate = monthStart.toISOString().split("T")[0];
		const endDate = monthEnd.toISOString().split("T")[0];

		const logs = await WorkLog.find({
			userId: user._id,
			date: { $gte: startDate, $lte: endDate },
		}).sort({ date: -1 });

		const presentModes = new Set(["REMOTE", "OFFICE", "HYBRID"]);
		const presentDays = logs.filter((log) => presentModes.has(log.actualMode)).length;
		const officeDays = logs.filter((log) => log.actualMode === "OFFICE").length;
		const remoteDays = logs.filter((log) => log.actualMode === "REMOTE").length;
		const hybridDays = logs.filter((log) => log.actualMode === "HYBRID").length;
		const deviations = logs.filter((log) =>
			["ABSENT", "UNLOGGED"].includes(log.actualMode)
		).length;

		const totalDays = logs.length;
		const attendancePercentage = totalDays
			? Math.round((presentDays / totalDays) * 100)
			: 0;

		const logMap = new Map(logs.map((log) => [log.date, log]));
		let streak = 0;
		let cursor = new Date();

		for (let i = 0; i < 31; i += 1) {
			const dateKey = cursor.toISOString().split("T")[0];
			const log = logMap.get(dateKey);
			if (log && presentModes.has(log.actualMode)) {
				streak += 1;
				cursor.setDate(cursor.getDate() - 1);
			} else {
				break;
			}
		}

		return res.status(200).json({
			success: true,
			data: {
				attendancePercentage,
				presentDays,
				streak,
				deviations,
				officeDays,
				remoteDays,
				hybridDays,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch attendance summary",
		});
	}
};
