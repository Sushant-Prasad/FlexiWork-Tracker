// Allowed plan modes
export const SHIFT_MODES = ["REMOTE", "OFFICE", "HYBRID", "OFF"];

// Validate a mode value against the allowed list
export const isValidShiftMode = (mode) => SHIFT_MODES.includes(mode);

// Office info is only required for office-based modes
export const requiresOfficeInfo = (mode) => mode === "OFFICE" || mode === "HYBRID";

// Normalize office payload to avoid missing fields
export const normalizeOffice = (plannedOffice) => {
	if (!plannedOffice || typeof plannedOffice !== "object") {
		return { site: "", desk: "" };
	}
	return {
		site: plannedOffice.site || "", // Default empty site
		desk: plannedOffice.desk || "", // Default empty desk
	};
};

// Build a unique key for user + date
export const getPlanKey = (plan) => `${plan.userId}-${plan.date}`;

// Validate required fields and conditional office info
export const validatePlanBasics = (plan) => {
	const errors = [];

	if (!plan?.userId) errors.push("userId is required"); // Required user
	if (!plan?.date) errors.push("date is required"); // Required date
	if (!plan?.plannedMode) errors.push("plannedMode is required"); // Required mode

	if (plan?.plannedMode && !isValidShiftMode(plan.plannedMode)) {
		errors.push("plannedMode is invalid");
	}

	if (requiresOfficeInfo(plan?.plannedMode)) {
		const office = normalizeOffice(plan.plannedOffice);
		if (!office.site) {
			errors.push("plannedOffice.site is required for OFFICE or HYBRID");
		}
	}

	return errors;
};

// Find duplicate userId-date combinations in a batch
export const findDuplicateKeys = (plans) => {
	const seen = new Set();
	const duplicates = new Set();

	for (const plan of plans) {
		const key = getPlanKey(plan);
		if (seen.has(key)) duplicates.add(key); // Record duplicate
		seen.add(key);
	}

	return Array.from(duplicates);
};
