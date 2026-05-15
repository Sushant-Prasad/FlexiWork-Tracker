import { PROJECT_FLOW } from "./projectStatusFlow.js"; // Status flow

const STATUS_VALUES = Array.from(
  new Set(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED", ...Object.keys(PROJECT_FLOW)])
);

// Validate project payload for create or update
export const validateProjectData = (projectData, { isUpdate = false } = {}) => {
  const errors = [];

  if (!isUpdate) {
    if (!projectData?.title) errors.push("title is required");
    if (!projectData?.assignedTeam) errors.push("assignedTeam is required");
    if (!projectData?.deadline) errors.push("deadline is required");
  }

  if (projectData?.title !== undefined) {
    const trimmed = String(projectData.title).trim();
    if (trimmed.length < 2) errors.push("title must be at least 2 characters");
  }

  if (projectData?.startDate && projectData?.deadline) {
    if (projectData.deadline < projectData.startDate) {
      errors.push("deadline cannot be before startDate");
    }
  }

  if (projectData?.status !== undefined && !STATUS_VALUES.includes(projectData.status)) {
    errors.push("status is invalid");
  }

  return { isValid: errors.length === 0, errors };
};
