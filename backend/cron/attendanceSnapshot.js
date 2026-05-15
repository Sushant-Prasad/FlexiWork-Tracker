import cron from "node-cron"; // Scheduler for nightly snapshots
import ShiftPlan from "../models/ShiftPlan.js"; // Planned shifts
import WorkLog from "../models/WorkLog.js"; // Actual work logs
import DailySnapshot from "../models/DailySnapshot.js"; // Snapshot analytics model
import { getTodayDate } from "../utils/dateUtils.js"; // Date helper
import { getAttendanceStatus } from "../utils/attendanceUtils.js"; // Comparison utility

// Run the daily attendance job for a given date
const runDailyAttendanceJob = async (date) => {
	const plans = await ShiftPlan.find({ date }); // All plans for the day
	const logs = await WorkLog.find({ date }); // All logs for the day

	const logMap = new Map(); // Fast lookup by user+date
	for (const log of logs) {
		logMap.set(`${log.userId}_${log.date}`, log);
	}

	let matchedCount = 0;
	let deviationCount = 0;
	let unloggedCount = 0;

	let officeCount = 0;
	let remoteCount = 0;
	let hybridCount = 0;
	let absentCount = 0;

	for (const plan of plans) {
		const log = logMap.get(`${plan.userId}_${date}`); // Get matching log
		const status = getAttendanceStatus(plan.plannedMode, log?.actualMode); // Compare

		if (status === "MATCH") matchedCount += 1;
		if (status === "DEVIATION") deviationCount += 1;
		if (status === "UNLOGGED") unloggedCount += 1;

		const actualMode = log?.actualMode;
		if (actualMode === "OFFICE") officeCount += 1;
		if (actualMode === "REMOTE") remoteCount += 1;
		if (actualMode === "HYBRID") hybridCount += 1;
		if (actualMode === "ABSENT") absentCount += 1;
	}

	const totalPlanned = plans.length;
	const totalLogged = logs.length;
	const adherencePct = totalPlanned > 0 ? (matchedCount / totalPlanned) * 100 : 0;

	await DailySnapshot.create({
		date,
		totalPlanned,
		totalLogged,
		matchedCount,
		deviationCount,
		unloggedCount,
		officeCount,
		remoteCount,
		hybridCount,
		absentCount,
		metadata: { adherencePct },
	});
};

// Schedule nightly snapshot at 10:30 PM IST
cron.schedule(
	"30 22 * * *",
	async () => {
		try {
			const today = getTodayDate(); // YYYY-MM-DD
			await runDailyAttendanceJob(today); // Generate snapshot
		} catch (error) {
			console.error("Attendance snapshot job failed:", error); // Log failures
		}
	},
	{
		timezone: "Asia/Kolkata", // Run in India time
	}
);

export { runDailyAttendanceJob };
