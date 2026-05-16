import cron from "node-cron"; // Scheduler for nightly tasks
import WorkLog from "../models/WorkLog.js"; // Work log model
import User from "../models/User.js"; // User model
import { sendNotification } from "../utils/sendNotification.js"; // Notification helper
import { getEditableUntil, getTodayDate } from "../utils/dateUtils.js"; // Date helpers

/*
Nightly WorkLog Check
Purpose
- At 10:15 PM, create UNLOGGED entries for users missing logs and notify them.
*/

cron.schedule("15 22 * * *", async () => {
	try {
		const today = getTodayDate(); // Today's date in YYYY-MM-DD
		const users = await User.find(); // All active users (adjust if you track status)

		for (const user of users) {
			const log = await WorkLog.findOne({ userId: user._id, date: today }); // Check today's log

			if (!log) {
				await WorkLog.create({
					userId: user._id,
					date: today,
					actualMode: "UNLOGGED", // Mark missing log
					editableUntil: getEditableUntil(), // Today's cutoff
					source: "AUTO", // Created by system
				});

				await sendNotification({
					userId: user._id,
					title: "Missing work log",
					message: `You have not logged your work for ${today}.`,
					type: "MISSING_LOG",
				});
			}
		}
	} catch (error) {
		console.error("Nightly work log check failed:", error); // Log failures for troubleshooting
	}
}, {
	timezone: "Asia/Kolkata", // Run cron in India time
});
