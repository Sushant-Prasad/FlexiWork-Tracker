import { TASK_FLOW } from "./taskStatusFlow.js"; // Status transitions

// Check whether the role can move between statuses
export const canUpdateTaskStatus = ({ role, currentStatus, newStatus, isAssignee }) => {
  if (!newStatus || newStatus === currentStatus) return true;

  const nextStatuses = TASK_FLOW[currentStatus] || [];
  const isValidTransition = nextStatuses.includes(newStatus);
  if (!isValidTransition) return false;

  const isManager = role === "MANAGER" || role === "SYSTEM_ADMIN";

  // Employee flow is limited to early stages
  if (role === "EMPLOYEE") {
    if (!isAssignee) return false;
    return ["TODO", "IN_PROGRESS"].includes(currentStatus);
  }

  // Manager/admin can approve later-stage transitions
  if (isManager) {
    return ["READY_FOR_REVIEW", "TESTING", "CHANGES_REQUESTED"].includes(currentStatus);
  }

  return false;
};
