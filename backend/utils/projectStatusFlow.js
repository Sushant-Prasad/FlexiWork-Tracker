// Defines valid project lifecycle transitions
export const PROJECT_FLOW = {
  PLANNING: ["ACTIVE"],
  ACTIVE: ["ON_HOLD", "COMPLETED"],
  ON_HOLD: ["ACTIVE", "CANCELLED"],
};

// Validate status transitions using the flow map
export const isValidProjectTransition = (currentStatus, nextStatus) => {
  if (!nextStatus || nextStatus === currentStatus) return true;
  const allowed = PROJECT_FLOW[currentStatus] || [];
  return allowed.includes(nextStatus);
};
