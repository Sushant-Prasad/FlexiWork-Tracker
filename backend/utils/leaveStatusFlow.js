// Defines valid leave status transitions
export const LEAVE_FLOW = {
  PENDING: ["APPROVED", "REJECTED"],
};

// Validate status transitions using the flow map
export const isValidLeaveTransition = (currentStatus, nextStatus) => {
  if (!nextStatus || nextStatus === currentStatus) return true;
  const allowed = LEAVE_FLOW[currentStatus] || [];
  return allowed.includes(nextStatus);
};
