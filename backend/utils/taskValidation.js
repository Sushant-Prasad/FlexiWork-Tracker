import { getTodayDate } from "./dateUtils.js"; // Date helper

const STATUS_VALUES = [
  "TODO",
  "IN_PROGRESS",
  "READY_FOR_REVIEW",
  "TESTING",
  "DONE",
  "CHANGES_REQUESTED",
];

// Validate task payload for create or update
export const validateTaskData = (taskData, { isUpdate = false } = {}) => {
  const errors = [];
  const today = getTodayDate(); // YYYY-MM-DD

  if (!isUpdate) {
    if (!taskData?.title) errors.push("title is required");
    if (!taskData?.assignedTo) errors.push("assignedTo is required");
    if (!taskData?.projectId) errors.push("projectId is required");
  }

  if (taskData?.title !== undefined) {
    const trimmed = String(taskData.title).trim();
    if (trimmed.length < 2) errors.push("title must be at least 2 characters");
  }

  if (taskData?.effortHrs !== undefined) {
    const effort = Number(taskData.effortHrs);
    if (Number.isNaN(effort) || effort <= 0) {
      errors.push("effortHrs must be greater than 0");
    }
  }

  if (taskData?.dueDate) {
    if (typeof taskData.dueDate !== "string") {
      errors.push("dueDate must be a string");
    } else if (taskData.dueDate < today) {
      errors.push("dueDate cannot be in the past");
    }
  }

  if (taskData?.status !== undefined && !STATUS_VALUES.includes(taskData.status)) {
    errors.push("status is invalid");
  }

  return { isValid: errors.length === 0, errors };
};
