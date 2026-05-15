// Calculate hours between check-in and check-out timestamps
export const calculateWorkedHours = (checkInAt, checkOutAt) => {
	if (!checkInAt || !checkOutAt) {
		return 0; // Missing timestamps means zero hours
	}

	const diffMs = new Date(checkOutAt) - new Date(checkInAt); // Milliseconds difference

	return +(diffMs / (1000 * 60 * 60)).toFixed(2); // Convert to hours with 2 decimals
};
