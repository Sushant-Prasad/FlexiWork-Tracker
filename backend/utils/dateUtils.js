// Return today's date as YYYY-MM-DD
export const getTodayDate = () => {
	return new Date().toISOString().split("T")[0]; // ISO date without time
};

// Return today's 10 PM local time for edit cutoff
export const getEditableUntil = () => {
	const date = new Date(); // Start from current local date

	date.setHours(22, 0, 0, 0); // 10:00 PM local time

	return date;
};
