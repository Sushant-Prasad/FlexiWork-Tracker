const LEAVE_TYPES = ["PTO", "SICK", "WFH"];

// Validate leave payload and basic rules
export const validateLeaveRequest = (leaveData, { existingLeaves = [] } = {}) => {
  const errors = [];

  if (!leaveData?.type) errors.push("type is required");
  if (!leaveData?.startDate) errors.push("startDate is required");
  if (!leaveData?.endDate) errors.push("endDate is required");

  if (leaveData?.type && !LEAVE_TYPES.includes(leaveData.type)) {
    errors.push("type is invalid");
  }

  if (leaveData?.startDate && leaveData?.endDate) {
    if (leaveData.endDate < leaveData.startDate) {
      errors.push("endDate cannot be before startDate");
    }
  }

  const today = new Date().toISOString().split("T")[0];
  if (leaveData?.startDate && leaveData.startDate < today) {
    errors.push("startDate cannot be in the past");
  }

  if (existingLeaves.length > 0) {
    const overlaps = existingLeaves.some((leave) => {
      return leave.startDate <= leaveData.endDate && leave.endDate >= leaveData.startDate;
    });
    if (overlaps) {
      errors.push("Leave overlaps an existing approved request");
    }
  }

  return { isValid: errors.length === 0, errors };
};
