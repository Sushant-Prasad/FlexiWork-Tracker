// Compare planned and actual modes to determine attendance status
export const getAttendanceStatus = (plannedMode, actualMode) => {
	// OFF day never counts as a deviation
	if (plannedMode === "OFF") {
		return "OFF_DAY";
	}

	// Missing or unlogged actual mode
	if (!actualMode || actualMode === "UNLOGGED") {
		return "UNLOGGED";
	}

	// Exact match between planned and actual modes
	if (plannedMode === actualMode) {
		return "MATCH";
	}

	// Any mismatch counts as deviation
	return "DEVIATION";
};
